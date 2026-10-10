import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';

const compiled = ts.transpileModule(
  readFileSync(new URL('../../src/lib/validation-feedback.ts', import.meta.url), 'utf8'),
  { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } },
).outputText;

function setup(platform, fail = false) {
  let now = 1000;
  const calls = [];
  const feedback = (kind) => {
    calls.push(kind);
    return fail ? Promise.reject(new Error('Haptics unavailable')) : Promise.resolve();
  };
  const exports = {};
  new Function('require', 'exports', 'Date', compiled)(
    (name) => {
      if (name === 'react-native') return { Platform: { OS: platform } };
      if (name === 'expo-haptics')
        return {
          AndroidHaptics: { Reject: 'reject' },
          NotificationFeedbackType: { Error: 'error' },
          performAndroidHapticsAsync: feedback,
          notificationAsync: feedback,
        };
      throw new Error(`Unexpected dependency: ${name}`);
    },
    exports,
    { now: () => now },
  );
  return { notify: exports.notifyValidationError, calls, advance: (ms) => (now += ms) };
}

test('Android validation coalesces simultaneous errors and allows later feedback', () => {
  const s = setup('android');
  s.notify();
  s.notify();
  s.advance(249);
  s.notify();
  assert.deepEqual(s.calls, ['reject']);
  s.advance(1);
  s.notify();
  assert.deepEqual(s.calls, ['reject', 'reject']);
});

test('iOS validation selects notification error feedback', () => {
  const s = setup('ios');
  s.notify();
  assert.deepEqual(s.calls, ['error']);
});

test('unavailable haptics does not reject validation or prevent a later attempt', async () => {
  const s = setup('android', true);
  assert.doesNotThrow(() => s.notify());
  await new Promise((resolve) => setImmediate(resolve));
  s.advance(250);
  assert.doesNotThrow(() => s.notify());
  await new Promise((resolve) => setImmediate(resolve));
  assert.deepEqual(s.calls, ['reject', 'reject']);
});
