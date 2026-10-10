import assert from 'node:assert/strict';
import test from 'node:test';
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  verifyEmailSchema,
} from '../../src/validation/schemas/auth.ts';

const registration = {
  userName: 'alex',
  firstName: 'Alex',
  lastName: 'Morgan',
  email: 'alex@example.com',
  password: 'password ',
  confirmPassword: 'password ',
};

test('login accepts email or username, trims only the identifier, and preserves password whitespace', () => {
  for (const login of ['  Alex_User  ', '  ALEX@example.COM  ']) {
    assert.deepEqual(loginSchema.parse({ login, password: 'password ' }), {
      login: login.trim(),
      password: 'password ',
    });
  }
});
test('login enforces Identity identifier and password limits', () => {
  for (const details of [
    { login: '', password: '' },
    { login: 'aa', password: 'password' },
    { login: 'a'.repeat(257), password: 'password' },
    { login: 'alex', password: 'short' },
    { login: 'alex', password: 'p'.repeat(129) },
  ]) {
    assert.equal(loginSchema.safeParse(details).success, false);
  }
  assert.equal(
    loginSchema.safeParse({ login: 'a'.repeat(256), password: 'p'.repeat(128) }).success,
    true,
  );
});
test('registration uses backend fields, accepts international names, and normalizes email', () => {
  const result = registerSchema.parse({
    ...registration,
    firstName: ' أحمد ',
    lastName: ' بن علي ',
    email: ' ALEX@Example.COM ',
  });
  assert.equal(result.firstName, 'أحمد');
  assert.equal(result.lastName, 'بن علي');
  assert.equal(result.email, 'alex@example.com');
  assert.equal(result.password, 'password ');
});
test('password confirmation is required and whitespace remains significant', () => {
  for (const confirmPassword of ['', 'password']) {
    const result = registerSchema.safeParse({ ...registration, confirmPassword });
    assert.equal(result.success, false);
    assert.ok(result.error.issues.some((issue) => issue.path[0] === 'confirmPassword'));
  }
});
test('registration follows username, name, and password boundary lengths', () => {
  assert.equal(
    registerSchema.safeParse({
      ...registration,
      userName: 'a'.repeat(50),
      firstName: 'a'.repeat(100),
      lastName: '',
      password: 'p'.repeat(128),
      confirmPassword: 'p'.repeat(128),
    }).success,
    true,
  );
  for (const field of ['userName', 'firstName', 'lastName', 'password']) {
    const limit = field === 'userName' ? 50 : field === 'password' ? 128 : 100;
    const result = registerSchema.safeParse({ ...registration, [field]: 'a'.repeat(limit + 1) });
    assert.equal(result.success, false);
    assert.ok(result.error.issues.some((issue) => issue.path[0] === field));
  }
});
test('forgot-password rejects malformed emails and normalizes valid input', () => {
  for (const email of ['', ' ', 'alex@', 'alex example.com', 'a'.repeat(257) + '@example.com']) {
    assert.equal(forgotPasswordSchema.safeParse({ email }).success, false);
  }
  assert.deepEqual(forgotPasswordSchema.parse({ email: ' ALEX@Example.COM ' }), {
    email: 'alex@example.com',
  });
});
test('verification accepts exactly six digits including leading zeroes', () => {
  assert.deepEqual(verifyEmailSchema.parse({ code: ' 001234 ' }), { code: '001234' });
  for (const code of ['', '12345', '1234567', '123abc'])
    assert.equal(verifyEmailSchema.safeParse({ code }).success, false);
});
