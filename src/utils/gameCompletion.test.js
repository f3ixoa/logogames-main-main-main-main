import test from 'node:test';
import assert from 'node:assert/strict';
import { completionActions } from './gameCompletion.js';

test('completion uses the defined next activity when available', () => {
  const action = () => {};
  const result = completionActions({ nextActivity: action, gameSelection: () => {} });
  assert.equal(result.next, action);
  assert.equal(result.hasDefinedNextActivity, true);
});

test('completion falls back to game selection when there is no next activity', () => {
  const fallback = () => {};
  const result = completionActions({ gameSelection: fallback });
  assert.equal(result.next, fallback);
  assert.equal(result.hasDefinedNextActivity, false);
});
