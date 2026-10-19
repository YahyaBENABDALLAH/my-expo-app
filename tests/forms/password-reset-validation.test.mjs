import assert from 'node:assert/strict';
import test from 'node:test';
import {
  isValidPasswordResetChallengeId,
  passwordResetSchema,
} from '../../src/validation/schemas/password-reset.ts';

const recovery = {
  code: '001234',
  newPassword: 'password ',
  confirmPassword: 'password ',
};
const challengeId = '550e8400-e29b-41d4-a716-446655440000';

test('recovery link accepts a UUID challenge in either letter case', () => {
  for (const value of [challengeId, challengeId.toUpperCase()]) {
    assert.equal(isValidPasswordResetChallengeId(value), true);
  }
});

test('recovery link rejects absent, malformed, and repeated challenge parameters', () => {
  for (const value of [
    undefined,
    null,
    '',
    'not-a-uuid',
    ` ${challengeId} `,
    challengeId.replace('41d4', '41dg'),
    [],
    [challengeId],
    [challengeId, challengeId],
    123,
    { challengeId },
  ]) {
    assert.equal(isValidPasswordResetChallengeId(value), false, JSON.stringify(value));
  }
});

test('password reset trims recovery codes, preserves leading zeroes and password whitespace', () => {
  assert.deepEqual(passwordResetSchema.parse({ ...recovery, code: ' \t001234\n' }), {
    code: '001234',
    newPassword: 'password ',
    confirmPassword: 'password ',
  });
});

test('recovery code rejects anything other than exactly six ASCII digits', () => {
  for (const code of ['', ' ', '12345', '1234567', '123abc', '12 345', '٠٠١٢٣٤', 123456]) {
    const result = passwordResetSchema.safeParse({ ...recovery, code });
    assert.equal(result.success, false, JSON.stringify(code));
    assert.deepEqual(
      result.error.issues.map((issue) => issue.path),
      [['code']],
    );
  }
});

test('password reset accepts both password length boundaries without trimming', () => {
  for (const newPassword of ['passwor ', 'p'.repeat(128)]) {
    assert.deepEqual(
      passwordResetSchema.parse({ ...recovery, newPassword, confirmPassword: newPassword }),
      { code: '001234', newPassword, confirmPassword: newPassword },
    );
  }
});

test('password reset rejects passwords immediately outside its length limits', () => {
  for (const newPassword of ['p'.repeat(7), 'p'.repeat(129)]) {
    const result = passwordResetSchema.safeParse({
      ...recovery,
      newPassword,
      confirmPassword: newPassword,
    });
    assert.equal(result.success, false, `password length ${newPassword.length}`);
    assert.deepEqual(
      result.error.issues.map((issue) => issue.path),
      [['newPassword']],
    );
  }
});

test('password confirmation reports mismatch on confirmation and treats whitespace as significant', () => {
  for (const confirmPassword of ['', 'password', 'different']) {
    const result = passwordResetSchema.safeParse({ ...recovery, confirmPassword });
    assert.equal(result.success, false, JSON.stringify(confirmPassword));
    assert.deepEqual(
      result.error.issues.map(({ path, message }) => ({ path, message })),
      [{ path: ['confirmPassword'], message: 'auth.passwordMismatch' }],
    );
  }
});
