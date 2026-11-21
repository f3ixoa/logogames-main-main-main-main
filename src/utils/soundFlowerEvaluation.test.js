import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateSoundFlowerAttempt } from './soundFlowerEvaluation.js';

const voicedSegments = [{ start: 0, end: 180, duration: 180 }];
const base = {
  targetMatched: true,
  voiceDetected: true,
  noiseFloorRms: 0.01,
  voiceReferenceRms: 0.1,
  peakRms: 0.09,
  meanVoicedRms: 0.04,
  segments: voicedSegments
};

test('TARGET_MODE_PASS: target plus loud acoustic mode passes', () => {
  assert.equal(evaluateSoundFlowerAttempt({ ...base, mode: 'loud' }).passed, true);
});

test('TARGET_WRONG_MODE: recognized target with failed mode does not pass', () => {
  const result = evaluateSoundFlowerAttempt({ ...base, mode: 'long', segments: voicedSegments });
  assert.equal(result.passed, false);
  assert.equal(result.diagnosticReason, 'no-sustained-segment');
});

test('WRONG_TARGET: acoustic signal without target match does not pass', () => {
  const result = evaluateSoundFlowerAttempt({ ...base, mode: 'loud', targetMatched: false });
  assert.equal(result.passed, false);
  assert.equal(result.diagnosticReason, 'target-not-recognized');
});

test('SILENCE: no voiced signal does not pass', () => {
  const result = evaluateSoundFlowerAttempt({ ...base, mode: 'soft', voiceDetected: false });
  assert.equal(result.passed, false);
  assert.equal(result.diagnosticReason, 'no-voiced-signal');
});

test('TECH_ERROR: recognition service error is technical, not a failed attempt', () => {
  const result = evaluateSoundFlowerAttempt({ ...base, mode: 'loud', technicalError: 'Network error' });
  assert.equal(result.passed, false);
  assert.equal(result.technicalError, 'Network error');
  assert.equal(result.diagnosticReason, 'technical-error');
});

test('short mode requires three short bursts separated by pauses', () => {
  const segments = [0, 300, 600].map((start) => ({ start, end: start + 120, duration: 120 }));
  assert.equal(evaluateSoundFlowerAttempt({ ...base, mode: 'short', segments }).passed, true);
});

test('soft gate uses individual voice reference and ambient noise floor', () => {
  assert.equal(evaluateSoundFlowerAttempt({ ...base, mode: 'soft', peakRms: 0.035, meanVoicedRms: 0.025 }).passed, true);
  assert.equal(evaluateSoundFlowerAttempt({ ...base, mode: 'soft', peakRms: 0.09, meanVoicedRms: 0.08 }).passed, false);
});
