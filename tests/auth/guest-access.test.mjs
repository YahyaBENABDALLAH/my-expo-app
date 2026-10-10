import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';
import { AUTH_STATUS } from '../../src/constants/auth.constant.ts';

const compiled = ts.transpileModule(
  readFileSync(new URL('../../src/guards/auth-guards.ts', import.meta.url), 'utf8'),
  { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } },
).outputText;
const exports = {};
new Function('require', 'exports', compiled)((name) => {
  if (name === '@/constants/auth.constant') return { AUTH_STATUS };
  if (name === '@/constants/app-dev') return { appDevEnabled: false };
  if (name === '@/context/auth.context') return {};
  throw new Error(`Unexpected dependency: ${name}`);
}, exports);
const { authAccess } = exports;

test('production rejects guest access even if the guest flag is set', () => {
  assert.deepEqual(authAccess(AUTH_STATUS.UNAUTHENTICATED, false, true), {
    requireAuth: false,
    requireNoAuth: true,
    restoring: false,
  });
});
test('development guest access allows browsing and signed-out auth routes', () => {
  assert.deepEqual(authAccess(AUTH_STATUS.UNAUTHENTICATED, true, true), {
    requireAuth: true,
    requireNoAuth: true,
    restoring: false,
  });
  assert.equal(authAccess(AUTH_STATUS.UNAUTHENTICATED, true, false).requireAuth, false);
});
test('guest access never bypasses session restoration', () => {
  assert.deepEqual(authAccess(AUTH_STATUS.UNKNOWN, true, true), {
    requireAuth: false,
    requireNoAuth: false,
    restoring: true,
  });
});
test('real sessions preserve normal authenticated routing', () => {
  assert.deepEqual(authAccess(AUTH_STATUS.AUTHENTICATED, false, false), {
    requireAuth: true,
    requireNoAuth: false,
    restoring: false,
  });
});
