import test from 'node:test';
import assert from 'node:assert/strict';
import { matchesExactWord, matchesSyllable } from './speechRecognition.js';

test('syllable matching accepts exact target and isolated target consonant', () => {
  assert.equal(matchesSyllable('РЭ', 'РЭ'), true);
  assert.equal(matchesSyllable('Р', 'РЭ'), true);
  assert.equal(matchesSyllable('Р', 'РЕ'), true);
  assert.equal(matchesSyllable('Л', 'ЛЭ'), true);
});

test('syllable matching rejects unrelated or hard-soft-confused consonants', () => {
  assert.equal(matchesSyllable('Л', 'РЭ'), false);
  assert.equal(matchesSyllable('Р', 'ЛЕ'), false);
  assert.equal(matchesSyllable('С', 'ЗА'), false);
});

test('exact-word mode stays exact and does not accept consonant-only evidence', () => {
  assert.equal(matchesExactWord('кот', 'кот'), true);
  assert.equal(matchesExactWord('это кот', 'кот'), false);
  assert.equal(matchesExactWord('Р', 'РЭ'), false);
});
