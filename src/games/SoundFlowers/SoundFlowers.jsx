import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSoundById } from '../../data/sounds';
import { GameExitDialog, GameHeader } from '../../components/GameChrome/GameChrome';
import GameResult from '../../components/GameResult/GameResult';
import { speakText } from '../../utils/speechSynthesis';
import { isSoundEnabled, subscribeToSoundPreference } from '../../utils/audioPreference';
import { beginSoundFlowerAttempt } from '../../utils/soundFlowerAnalyzer';
import './SoundFlowers.css';

const modes = [
  { id: 'loud', title: 'Громкий цветок', badge: 'ГРОМКО', animal: 'lion', instruction: 'Это громкий цветок! Произноси звук громко!' },
  { id: 'soft', title: 'Тихий цветок', badge: 'ТИХО', animal: 'monkey', instruction: 'Это тихий цветок! Произноси звук тихо!' },
  { id: 'short', title: 'Короткий цветок', badge: 'КОРОТКО', animal: 'bee', instruction: 'Это короткий цветок! Произноси звук коротко, отрывисто!' },
  { id: 'long', title: 'Длинный цветок', badge: 'ДЛИННО', animal: 'chameleon', instruction: 'Это длинный цветок! Произноси звук долго и протяжно!' }
];

function Animal({ type }) {
  if (type === 'lion') return <g><circle cx="50" cy="50" r="22" fill="#d97706"/><circle cx="50" cy="50" r="18" fill="#fbbf24"/><circle cx="36" cy="36" r="6" fill="#d97706"/><circle cx="64" cy="36" r="6" fill="#d97706"/><ellipse cx="50" cy="55" rx="8" ry="6" fill="#fef08a"/><polygon points="50,51 47,47 53,47" fill="#78350f"/><circle cx="43" cy="46" r="2.5"/><circle cx="57" cy="46" r="2.5"/><circle cx="38" cy="54" r="2.5" fill="#f87171"/><circle cx="62" cy="54" r="2.5" fill="#f87171"/></g>;
  if (type === 'monkey') return <g><circle cx="50" cy="50" r="19" fill="#92400e"/><circle cx="33" cy="50" r="6" fill="#d97706"/><circle cx="67" cy="50" r="6" fill="#d97706"/><circle cx="33" cy="50" r="3.5" fill="#fde047"/><circle cx="67" cy="50" r="3.5" fill="#fde047"/><ellipse cx="50" cy="53" rx="13" ry="11" fill="#fde047"/><circle cx="43" cy="47" r="2.5"/><circle cx="57" cy="47" r="2.5"/><circle cx="50" cy="52" r="2" fill="#451a03"/><path d="M46 56Q50 60 54 56" fill="none" stroke="#451a03" strokeWidth="1.5"/></g>;
  if (type === 'bee') return <g><ellipse cx="34" cy="38" rx="8" ry="12" fill="#e0f2fe" transform="rotate(-30 34 38)"/><ellipse cx="66" cy="38" rx="8" ry="12" fill="#e0f2fe" transform="rotate(30 66 38)"/><ellipse cx="50" cy="52" rx="17" ry="15" fill="#facc15"/><path d="M35 50H65M37 56H63" stroke="#0f172a" strokeWidth="3"/><circle cx="43" cy="46" r="3"/><circle cx="57" cy="46" r="3"/><path d="M47 58Q50 61 53 58" fill="none" stroke="#0f172a" strokeWidth="1.5"/></g>;
  return <g><path d="M32 40Q50 25 68 40Q65 65 35 60Z" fill="#22c55e"/><path d="M40 32Q50 28 60 32" stroke="#16a34a" strokeWidth="2" fill="none"/><circle cx="42" cy="44" r="5" fill="#fef08a"/><circle cx="42" cy="44" r="2.5" fill="#022c22"/><circle cx="58" cy="44" r="5" fill="#fef08a"/><circle cx="58" cy="44" r="2.5" fill="#022c22"/><path d="M47 53Q50 56 53 53" stroke="#15803d" strokeWidth="2" fill="none"/></g>;
}
function FlowerArt({ mode }) {
  return <svg viewBox="0 0 100 100" className="sf-art" aria-hidden="true"><g className="sf-petals">{[0,45,90,135,180,225,270,315].map((angle,index)=><g key={angle} transform={`rotate(${angle} 50 50)`}><path d="M50 50Q36 12 50 2Q64 12 50 50Z" fill={index%2?'var(--petal-b)':'var(--petal-a)'}/></g>)}</g><circle cx="50" cy="50" r="23" fill="var(--center)"/><circle cx="50" cy="50" r="20" fill="#fff" opacity=".2"/><Animal type={mode.animal}/></svg>;
}
function Parrot() {
  return <svg viewBox="0 0 100 120" role="img" aria-label="Попугай Тоти" className="sf-parrot"><path d="M40 80Q20 115 10 120Q35 110 45 90Z" fill="#ef4444"/><path d="M45 80Q30 115 25 120Q45 110 50 90Z" fill="#3b82f6"/><path d="M50 80Q40 115 40 120Q55 110 55 90Z" fill="#eab308"/><ellipse cx="50" cy="65" rx="22" ry="28" fill="#10b981"/><ellipse cx="52" cy="68" rx="15" ry="20" fill="#facc15"/><circle cx="58" cy="35" r="20" fill="#ef4444"/><circle cx="62" cy="32" r="14" fill="#3b82f6"/><circle cx="66" cy="28" r="6" fill="white"/><circle cx="68" cy="28" r="3" fill="#0f172a"/><path d="M72 32Q90 35 78 48Q70 42 72 32Z" fill="#f97316"/><path d="M32 55Q20 70 38 85Q52 75 42 55Z" fill="#3b82f6"/><path d="M50 18Q45 5 54 12Q58 2 62 16Z" fill="#facc15"/></svg>;
}

export default function SoundFlowers() {
  const { soundId } = useParams();
  const navigate = useNavigate();
  const sound = getSoundById(soundId);
  const target = sound?.sound.replace(/[’'`]/g, '') || '';
  const [completed, setCompleted] = useState([]);
  const [failedAttempts, setFailedAttempts] = useState({ loud: 0, soft: 0, short: 0, long: 0 });
  const [selected, setSelected] = useState('loud');
  const [busy, setBusy] = useState(false);
  const [micLevel, setMicLevel] = useState(0);
  const [soundOn, setSoundOn] = useState(isSoundEnabled);
  const [message, setMessage] = useState(`Привет! Я Тоти! Сегодня мы будем учиться произносить звук «${target}» по-разному. У нас есть четыре волшебных цветка. Давай попробуем!`);
  const [error, setError] = useState('');
  const [transcript, setTranscript] = useState('');
  const [exitOpen, setExitOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const activeRef = useRef(null);
  const generationRef = useRef(0);
  const soundRef = useRef(soundOn);
  const completedRef = useRef(completed);
  const failedAttemptsRef = useRef(failedAttempts);
  const holdPointerRef = useRef(null);
  const releaseRequestedRef = useRef(false);
  const voiceReferenceRef = useRef({ rms: 0 });

  useEffect(() => subscribeToSoundPreference((value) => { soundRef.current = value; setSoundOn(value); if (!value) window.speechSynthesis?.cancel(); }), []);
  useEffect(() => { if (isSoundEnabled()) speakText(message); }, []);
  useEffect(() => { completedRef.current = completed; }, [completed]);
  useEffect(() => { failedAttemptsRef.current = failedAttempts; }, [failedAttempts]);
  useEffect(() => {
    const releaseOutside = (event) => {
      if (holdPointerRef.current === event.pointerId) {
        holdPointerRef.current = null;
        releaseMic();
      }
    };
    window.addEventListener('pointerup', releaseOutside);
    window.addEventListener('pointercancel', releaseOutside);
    return () => {
      window.removeEventListener('pointerup', releaseOutside);
      window.removeEventListener('pointercancel', releaseOutside);
      generationRef.current += 1;
      activeRef.current?.stop?.();
      activeRef.current = null;
      window.speechSynthesis?.cancel();
    };
  }, []);
  useEffect(() => { if (!sound) navigate('/', { replace: true }); }, [sound, navigate]);
  if (!sound) return null;

  const announce = (text) => { setMessage(text); if (soundRef.current) speakText(text); };
  const choose = (mode) => { if (busy) return; setSelected(mode.id); setError(''); announce(mode.instruction); };
  const start = async (modeId = selected, pointerId = null) => {
    if (busy || completedRef.current.includes(modeId)) return;
    const mode = modes.find((item) => item.id === modeId);
    const generation = ++generationRef.current;
    // Stop Toti before opening the mic so her prompt cannot be classified as the child's voice.
    window.speechSynthesis?.cancel();
    holdPointerRef.current = pointerId;
    setSelected(mode.id); setBusy(true); setError(''); setTranscript('');
    try {
      if (generation !== generationRef.current) return;
      if (releaseRequestedRef.current) {
        releaseRequestedRef.current = false;
        holdPointerRef.current = null;
        setBusy(false);
        setMicLevel(0);
        setError('Микрофон ещё подключался, когда кнопку отпустили. Удерживай её, пока появится сигнал.');
        return;
      }
      const attempt = await beginSoundFlowerAttempt(target, mode.id, {
        voiceReference: voiceReferenceRef.current.rms,
        onVoiceReference: (rms) => { voiceReferenceRef.current.rms = voiceReferenceRef.current.rms || rms; },
        onTranscript: (value) => { if (generation === generationRef.current) setTranscript(value); },
        onRecognitionError: (recognitionError) => { if (generation === generationRef.current) setError(recognitionError); },
        onAudioLevel: (rms, state) => { if (generation === generationRef.current) setMicLevel(Math.min(1, rms * 8)); }
      });
      if (generation !== generationRef.current) { attempt.stop(); return; }
      activeRef.current = attempt;
      if (releaseRequestedRef.current) {
        releaseRequestedRef.current = false;
        attempt.release();
      }
      const result = await attempt.result;
      if (generation !== generationRef.current) return;
      activeRef.current = null; holdPointerRef.current = null; setBusy(false); setMicLevel(0);
      if (result.technicalError || result.recognitionError) {
        setError(result.technicalError || result.recognitionError);
        return;
      }
      if (!result.voiceDetected) {
        announce('Я не услышал голос. Попробуй произнести звук ближе к устройству.');
        return;
      }
      if (!result.targetMatched || !result.modePass) {
        const nextCount = (failedAttemptsRef.current[mode.id] || 0) + 1;
        const nextFailures = { ...failedAttemptsRef.current, [mode.id]: nextCount };
        failedAttemptsRef.current = nextFailures;
        setFailedAttempts(nextFailures);
        const reason = !result.targetMatched
          ? `Попробуй произнести звук «${target}» ещё раз!`
          : mode.id === 'loud' ? 'Попробуй произнести звук громче!'
            : mode.id === 'soft' ? 'Попробуй произнести звук тише, но так, чтобы его было слышно!'
              : mode.id === 'short' ? 'Скажи не меньше трёх коротких звуков с паузами!'
                : 'Потяни звук дольше!';
        if (nextCount >= 3) announce('Молодец! Если ты произнёс звук правильно, нажми на кнопку под цветком!');
        else announce(nextCount === 1 ? reason : `${reason} У тебя обязательно получится.`);
        setError(reason);
        return;
      }
      completeFlower(mode.id);
    } catch (cause) {
      if (generation !== generationRef.current) return;
      activeRef.current = null; holdPointerRef.current = null; releaseRequestedRef.current = false; setBusy(false); setMicLevel(0); setError(cause.message || 'Не удалось включить микрофон. Проверь разрешение и попробуй снова.');
    }
  };
  const completeFlower = (modeId) => {
    if (completedRef.current.includes(modeId)) return;
    const next = [...completedRef.current, modeId];
    completedRef.current = next; setCompleted(next);
    const nextFailures = { ...failedAttemptsRef.current, [modeId]: 0 };
    failedAttemptsRef.current = nextFailures; setFailedAttempts(nextFailures);
    setError(''); setMicLevel(0);
    if (next.length === modes.length) {
      announce('Ура! Ты выполнил все задания! Ты большой молодец!');
      setShowResult(true);
    } else announce('Молодец! У тебя получилось!');
  };
  const beginHold = (modeId, event) => {
    if (busy || (event.button !== undefined && event.button > 0) || completedRef.current.includes(modeId)) return;
    event.preventDefault();
    try { event.currentTarget.setPointerCapture(event.pointerId); } catch { /* releaseOutside handles fallback */ }
    start(modeId, event.pointerId);
  };
  const releaseMic = () => {
    if (!busy) return;
    holdPointerRef.current = null;
    releaseRequestedRef.current = true;
    if (activeRef.current) activeRef.current.release();
  };
  const stop = () => { holdPointerRef.current = null; releaseRequestedRef.current = false; generationRef.current += 1; activeRef.current?.stop?.(); activeRef.current = null; setBusy(false); setMicLevel(0); };
  const exit = () => { stop(); navigate(`/sound/${soundId}/category/sounds/games`); };
  const restart = () => { stop(); completedRef.current = []; setCompleted([]); failedAttemptsRef.current = { loud: 0, soft: 0, short: 0, long: 0 }; setFailedAttempts(failedAttemptsRef.current); setShowResult(false); setSelected('loud'); announce(`Привет! Я Тоти! Сегодня мы будем учиться произносить звук «${target}» по-разному. У нас есть четыре волшебных цветка. Давай попробуем!`); };

  if (showResult) return <GameResult score={4} total={4} gameName="Звуковые цветы" theme="flower" onRepeat={restart} onNextGame={() => navigate(`/sound/${soundId}/category/sounds/games`)} onHomeAction={() => navigate('/')} />;

  return <main className="sound-flowers">
    <GameHeader title="Звуковые цветы" theme="flower" withSound onBack={() => setExitOpen(true)}>
      <button type="button" className="game-header__button" onClick={() => announce(modes.find((item) => item.id === selected).instruction)} aria-label="Повторить подсказку" title="Повторить подсказку">↻</button>
      <button type="button" className="game-header__button" onClick={() => setSettingsOpen((value) => !value)} aria-expanded={settingsOpen} aria-label="Настройки" title="Настройки">⚙</button>
    </GameHeader>
    <section className="sf-intro"><div className="sf-target" style={{ '--sound-color': sound.color }}>{target}</div><div className="sf-mentor"><div className="sf-bubble"><b>Попугай-помощник Тоти:</b><p aria-live="polite">{message}</p><button type="button" onClick={() => soundRef.current && speakText(message)} disabled={!soundOn}>Послушать ещё раз</button></div><Parrot/></div></section>
    <p className="sf-progress" role="status">Расцвело: {completed.length} из 4</p>
    {busy && <p className="sf-recognized" aria-live="polite">{transcript ? `Приложение услышало: ${transcript}` : 'Слушаю тебя…'}</p>}
    {settingsOpen && <aside className="sf-settings" aria-label="Настройки игры"><b>Настройки игры</b><p>Для проверки нужны микрофон и распознавание речи браузера. Отключение звука выключает только голосовые подсказки.</p><button type="button" onClick={() => setSettingsOpen(false)}>Понятно</button></aside>}
    {error && <p className="sf-error" role="alert">{error}</p>}
    <section className="sf-flowers" aria-label="Упражнения со звуком">
      {modes.map((mode) => <article key={mode.id} className={`sf-flower sf-flower--${mode.id}${selected === mode.id ? ' is-selected' : ''}${completed.includes(mode.id) ? ' is-complete' : ''}`}>
        <button type="button" className="sf-select" onClick={() => choose(mode)} aria-pressed={selected === mode.id}>
          <FlowerArt mode={mode}/><span className="sf-badge">{mode.badge}</span><strong>{mode.title}</strong>{completed.includes(mode.id) && <span className="sf-check" aria-label="Выполнено">✓</span>}
        </button>
        <button type="button" className={`sf-action sf-action--mic${busy && selected === mode.id ? ' is-listening' : ''}`} onPointerDown={(event) => beginHold(mode.id, event)} onPointerUp={releaseMic} onPointerCancel={releaseMic} onLostPointerCapture={(event) => { if (holdPointerRef.current === event.pointerId) releaseMic(); }} onKeyDown={(event) => { if ((event.code === 'Space' || event.code === 'Enter') && !event.repeat) beginHold(mode.id, event); }} onKeyUp={(event) => { if (event.code === 'Space' || event.code === 'Enter') releaseMic(); }} disabled={busy && selected !== mode.id || completed.includes(mode.id)} aria-label={busy && selected === mode.id ? 'Удерживай и произноси звук, отпусти для проверки' : `Удерживай, чтобы произнести звук ${target}`}>
          🎙 {busy && selected === mode.id ? 'Удерживай и говори…' : 'Удерживай и говори'}
        </button>
        {failedAttempts[mode.id] >= 3 && !completed.includes(mode.id) && <button type="button" className="sf-help-success" onClick={() => completeFlower(mode.id)}>Я произнёс правильно</button>}
        {failedAttempts[mode.id] > 0 && !completed.includes(mode.id) && <small className="sf-fail-count">Попыток: {failedAttempts[mode.id]} / 3</small>}
      </article>)}
    </section>
    <section className="sf-controls"><p className="sf-status" aria-live="polite">{busy ? 'Удерживай кнопку, произноси звук и отпусти для проверки.' : 'Выбери цветок, затем удерживай кнопку микрофона.'}</p>{busy && <div className="sf-meter" aria-label="Уровень сигнала микрофона"><span style={{ width: `${Math.round(micLevel * 100)}%` }}/></div>}<div className="sf-actions">{busy && <button type="button" onClick={stop}>Отменить</button>}</div><p className="sf-note">Для проверки нужны микрофон и распознавание речи в браузере. Распознавание изолированных согласных может быть неточным; это упражнение не является клинической оценкой.</p></section>
    {exitOpen && <GameExitDialog theme="flower" onStay={() => setExitOpen(false)} onExit={exit} />}
  </main>;
}
