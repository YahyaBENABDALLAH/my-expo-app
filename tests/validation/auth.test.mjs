import assert from 'node:assert/strict';
import test from 'node:test';

import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
} from '../../src/validation/schemas/auth.ts';

test('login normalizes email without changing the password', () => {
  assert.deepEqual(loginSchema.parse({ email: '  ALEX@example.COM  ', password: ' secret ' }), {
    email: 'alex@example.com',
    password: ' secret ',
  });
});

test('login requires both fields but accepts existing short passwords', () => {
  const result = loginSchema.safeParse({ email: '', password: '' });
  assert.equal(result.success, false);
  assert.deepEqual(
    result.error.issues.map(({ path }) => path[0]),
    ['email', 'password'],
  );
  assert.equal(loginSchema.safeParse({ email: 'alex@example.com', password: 'old' }).success, true);
});

test('registration accepts international names and checks password confirmation', () => {
  const details = {
    name: '  أحمد  ',
    email: 'alex@example.com',
    password: 'correct horse',
    confirmPassword: 'correct horse',
  };
  assert.equal(registerSchema.parse(details).name, 'أحمد');
  const result = registerSchema.safeParse({ ...details, confirmPassword: 'different password' });
  assert.equal(result.success, false);
  assert.deepEqual(result.error.issues[0].path, ['confirmPassword']);
  assert.equal(result.error.issues[0].message, 'Passwords do not match.');
});

test('registration rejects blank names and passwords shorter than eight characters', () => {
  const result = registerSchema.safeParse({
    name: '   ',
    email: 'alex@example.com',
    password: 'short',
    confirmPassword: 'short',
  });
  assert.equal(result.success, false);
  assert.deepEqual(
    result.error.issues.map(({ path }) => path[0]),
    ['name', 'password'],
  );
});

test('password whitespace remains significant when confirming', () => {
  const result = registerSchema.safeParse({
    name: 'Alex',
    email: 'alex@example.com',
    password: 'password ',
    confirmPassword: 'password',
  });
  assert.equal(result.success, false);
  assert.deepEqual(result.error.issues[0].path, ['confirmPassword']);
});

test('password reset rejects malformed email and normalizes a valid email', () => {
  for (const email of ['', '  ', 'alex@', 'alex example.com']) {
    assert.equal(forgotPasswordSchema.safeParse({ email }).success, false, email);
  }
  assert.deepEqual(forgotPasswordSchema.parse({ email: ' ALEX@Example.com ' }), {
    email: 'alex@example.com',
  });
});

test('registration accepts name and password limits and rejects values beyond them', () => {
  const details = {
    name: 'A'.repeat(80),
    email: 'alex@example.com',
    password: 'p'.repeat(128),
    confirmPassword: 'p'.repeat(128),
  };
  assert.equal(registerSchema.safeParse(details).success, true);
  const result = registerSchema.safeParse({
    ...details,
    name: 'A'.repeat(81),
    password: 'p'.repeat(129),
    confirmPassword: 'p'.repeat(129),
  });
  assert.equal(result.success, false);
  assert.deepEqual(
    result.error.issues.map(({ path }) => path[0]),
    ['name', 'password'],
  );
});

test('registration normalizes email and still requires password confirmation', () => {
  const details = {
    name: 'Alex',
    email: ' ALEX@Example.COM ',
    password: 'password',
    confirmPassword: 'password',
  };
  assert.equal(registerSchema.parse(details).email, 'alex@example.com');
  const result = registerSchema.safeParse({ ...details, confirmPassword: '' });
  assert.equal(result.success, false);
  assert.equal(result.error.issues[0].message, 'Confirm your password.');
});

test('all forms reject an email longer than the configured limit', () => {
  const email = `${'a'.repeat(64)}@${Array.from({ length: 4 }, () => 'b'.repeat(48)).join('.')}.com`;
  assert.ok(email.length > 254);
  for (const schema of [loginSchema, registerSchema, forgotPasswordSchema]) {
    const result = schema.safeParse({
      name: 'Alex',
      email,
      password: 'password',
      confirmPassword: 'password',
    });
    assert.equal(result.success, false);
    assert.ok(
      result.error.issues.some(
        ({ path, message }) => path[0] === 'email' && message === 'Email address is too long.',
      ),
    );
  }
});
