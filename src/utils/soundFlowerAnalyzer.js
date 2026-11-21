import { startSpeechRecognition, isSpeechRecognitionSupported } from './speechRecognition';
import { evaluateSoundFlowerAttempt } from './soundFlowerEvaluation';

const rmsOf = (data) => {
  let power = 0;
  for (let i = 0; i < data.length; i += 1) power += ((data[i] - 128) / 128) ** 2;
  return Math.sqrt(power / data.length);
};

const percentile = (values, fraction) => {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.floor((sorted.length - 1) * fraction))];
};

const VOICE_NOISE_MULTIPLIER = 2.2;
const VOICE_RELEASE_GAP_MS = 120;
const MIN_TOTAL_VOICED_MS = 50;
const SHORT_MIN_MS = 45;
const SHORT_MAX_MS = 350;
const SHORT_PAUSE_MS = 90;
const SHORT_REQUIRED_COUNT = 3;
const LONG_MIN_MS = 1000;


export const beginSoundFlowerAttempt = async (target, mode, callbacks = {}) => {
  if (!isSpeechRecognitionSupported()) throw new Error('Распознавание речи не поддерживается в этом браузере. Попробуй Chrome или Edge.');
  if (!navigator.mediaDevices?.getUserMedia) throw new Error('Микрофон доступен через HTTPS или localhost. Проверь разрешение микрофона в настройках браузера.');
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) throw new Error('Анализ звука не поддерживается в этом браузере.');

  let stream;
  let context;
  let source;
  let analyser;
  let frameId;
  let stopRecognition = () => {};
  let stopped = false;
  let released = false;
  let recognizedTarget = false;
  let transcript = '';
  let recognitionError = '';
  let resultSettled = false;
  let resolveResult;
  let rejectResult;
  let resolveRecognitionEnded;
  const result = new Promise((resolve, reject) => { resolveResult = resolve; rejectResult = reject; });
  const recognitionEnded = new Promise((resolve) => { resolveRecognitionEnded = resolve; });
  const settle = (callback, value) => {
    if (resultSettled) return;
    resultSettled = true;
    callback(value);
  };
  const cleanup = () => {
    if (stopped) return;
    stopped = true;
    if (frameId !== undefined) cancelAnimationFrame(frameId);
    stopRecognition();
    source?.disconnect();
    stream?.getTracks().forEach((track) => track.stop());
    if (context && context.state !== 'closed') context.close().catch(() => {});
  };

  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: false } });
    if (released) {
      stream.getTracks().forEach((track) => track.stop());
      throw new Error('Прослушивание остановлено.');
    }
    context = new AudioContextClass();
    await context.resume();
    if (released) throw new Error('Прослушивание остановлено.');
    source = context.createMediaStreamSource(stream);
    analyser = context.createAnalyser();
    analyser.fftSize = 1024;
    source.connect(analyser);

    const values = new Uint8Array(1024);
    const calibrationFrames = [];
    const voicedSegments = [];
    const beganAt = performance.now();
    let calibratedNoiseFloor = 0;
    let calibrationComplete = false;
    let voiceStart = 0;
    let lastVoice = 0;
    let quietStart = 0;
    let peakRms = 0;
    let voicedRmsTotal = 0;
    let voicedFrameCount = 0;
    let signalDetected = false;
    const finishSegment = () => {
      if (!voiceStart) return;
      voicedSegments.push({ start: voiceStart, end: lastVoice, duration: Math.max(0, lastVoice - voiceStart) });
      voiceStart = 0;
      quietStart = 0;
    };
    const processRms = (rms, time) => {
      const voiced = calibrationComplete && rms > Math.max(calibratedNoiseFloor * VOICE_NOISE_MULTIPLIER, Number.EPSILON);
      if (voiced) {
        signalDetected = true;
        peakRms = Math.max(peakRms, rms);
        voicedRmsTotal += rms;
        voicedFrameCount += 1;
        if (!voiceStart) voiceStart = time;
        lastVoice = time;
        quietStart = 0;
      } else if (voiceStart) {
        if (!quietStart) quietStart = time;
        if (time - quietStart >= VOICE_RELEASE_GAP_MS) finishSegment();
      }
    };

    // Buffer audio from the start of the hold. A robust low percentile estimates ambient floor;
    // all buffered frames are subsequently analyzed, so speech during calibration is not discarded.
    while (!calibrationComplete) {
      if (released) throw new Error('Прослушивание остановлено.');
      analyser.getByteTimeDomainData(values);
      const rms = rmsOf(values);
      const time = performance.now();
      calibrationFrames.push({ rms, time });
      if (time - beganAt >= 350) {
        calibratedNoiseFloor = percentile(calibrationFrames.map((item) => item.rms), 0.2);
        calibrationComplete = true;
        calibrationFrames.forEach((item) => processRms(item.rms, item.time));
      } else {
        await new Promise((resolve) => window.setTimeout(resolve, 20));
      }
    }

    stopRecognition = startSpeechRecognition(target, {
      onError: (message) => {
        if (released) return;
        recognitionError = message;
        callbacks.onRecognitionError?.(message);
      },
      onEnd: () => resolveRecognitionEnded(),
      onTranscript: (value) => { transcript = value; callbacks.onTranscript?.(value); },
      onResult: ({ matched, transcript: value }) => {
        recognizedTarget = recognizedTarget || matched;
        transcript = value || transcript;
      }
    }, {
      stream,
      continuous: true,
      // Syllable matching is shared with the sentence flow and supports phoneme targets.
      matchMode: 'syllable',
      onRecognitionUpdate: ({ matched, transcript: value }) => {
        recognizedTarget = recognizedTarget || matched;
        transcript = value || transcript;
      }
    });

    const frame = (time) => {
      if (stopped || released) return;
      analyser.getByteTimeDomainData(values);
      const rms = rmsOf(values);
      processRms(rms, time);
      const voiced = rms > Math.max(calibratedNoiseFloor * VOICE_NOISE_MULTIPLIER, Number.EPSILON);
      callbacks.onAudioLevel?.(rms, { voiced, peak: peakRms, durationMs: voicedSegments.length || voiceStart ? time - (voicedSegments[0]?.start || voiceStart) : 0 });
      frameId = requestAnimationFrame(frame);
    };
    frameId = requestAnimationFrame(frame);
    callbacks.onListening?.();

    const finish = async () => {
      if (released || stopped) return;
      released = true;
      finishSegment();
      const voicedDurations = voicedSegments.map((segment) => segment.duration);
      const meanVoicedRms = voicedFrameCount ? voicedRmsTotal / voicedFrameCount : 0;
      if (meanVoicedRms > 0) callbacks.onVoiceReference?.(meanVoicedRms);
      const totalVoicedMs = voicedDurations.reduce((sum, duration) => sum + duration, 0);
      const validSignal = signalDetected && totalVoicedMs >= MIN_TOTAL_VOICED_MS;
      const shortSegments = voicedSegments.filter((segment) => segment.duration >= SHORT_MIN_MS && segment.duration <= SHORT_MAX_MS);
      const separatedShortSegments = shortSegments.filter((segment, index) => index === 0
        || segment.start - shortSegments[index - 1].end >= SHORT_PAUSE_MS);
      const longestSegmentMs = Math.max(0, ...voicedDurations);
      const voiceReferenceRms = callbacks.voiceReference || 0;
      const evaluation = evaluateSoundFlowerAttempt({
        mode,
        targetMatched: recognizedTarget,
        voiceDetected: validSignal,
        technicalError: recognitionError,
        noiseFloorRms: calibratedNoiseFloor,
        voiceReferenceRms,
        peakRms,
        meanVoicedRms,
        segments: voicedSegments
      });
      const acousticPass = evaluation.acousticPass || false;
      const diagnosticReason = evaluation.diagnosticReason;

      if (typeof stopRecognition.finish === 'function') {
        stopRecognition.finish();
        await Promise.race([recognitionEnded, new Promise((resolve) => window.setTimeout(resolve, 900))]);
      }
      cleanup();
      settle(resolveResult, {
        recognizedTarget,
        targetMatched: recognizedTarget,
        transcript,
        acousticPass,
        modePass: acousticPass,
        voiceDetected: validSignal,
        signalDetected: validSignal,
        diagnosticReason,
        recognitionError,
        technicalError: evaluation.technicalError || recognitionError,
        peakRms,
        voiceReferenceRms,
        meanVoicedRms,
        noiseFloorRms: calibratedNoiseFloor,
        durationMs: voicedDurations.reduce((sum, duration) => sum + duration, 0),
        longestSegmentMs,
        segmentCount: voicedSegments.length,
        shortSegmentCount: separatedShortSegments.length
      });
    };

    return {
      result,
      release: finish,
      stop: () => {
        if (released || stopped) return;
        released = true;
        cleanup();
        settle(rejectResult, new Error('Прослушивание остановлено.'));
      }
    };
  } catch (error) {
    cleanup();
    if (error?.name === 'NotAllowedError' || error?.name === 'PermissionDeniedError') {
      throw new Error('Нет доступа к микрофону. Разреши его в настройках сайта или приложения и попробуй снова.');
    }
    if (error?.name === 'NotFoundError') throw new Error('Микрофон не найден или занят другим приложением.');
    throw error;
  }
};
