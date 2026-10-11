import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import * as axios from 'axios';
import ts from 'typescript';
import * as zod from 'zod';
import { createSourceLoader } from '../helpers/load-source.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../src');
const compiled = new Map();
const token = (accessToken = 'old') => ({
  userId: 'alice',
  email: 'alice@example.com',
  firstName: 'Alice',
  lastName: 'Cook',
  roles: [],
  accessToken,
  refreshToken: `refresh-${accessToken}`,
  accessTokenExpiresAtUtc: '2099-01-01T00:00:00Z',
  refreshTokenExpiresAtUtc: '2099-02-01T00:00:00Z',
  tokenType: 'Bearer',
  sessionId: 'session-alice',
  deviceId: 'device-alice',
});
const deferred = () => {
  let resolve;
  const promise = new Promise((yes) => {
    resolve = yes;
  });
  return { promise, resolve };
};
const response = (config, data) => ({ config, data, status: 200, statusText: 'OK', headers: {} });
const reject = (config, status, data) => {
  throw new axios.AxiosError('Request failed', 'ERR_BAD_REQUEST', config, null, {
    config,
    data,
    status,
    statusText: 'Error',
    headers: {},
  });
};

function setup(handler) {
  const storage = new Map();
  const requests = [];
  const dependencies = {
    '@/lib/i18n': createSourceLoader()('lib/i18n.ts'),
    zod,
    axios: {
      ...axios,
      create: (options) =>
        axios.create({
          ...options,
          adapter: async (config) => {
            requests.push(config);
            return handler(config);
          },
        }),
    },
    'expo-secure-store': {
      getItemAsync: async (key) => storage.get(key) ?? null,
      setItemAsync: async (key, value) => {
        storage.set(key, value);
      },
      deleteItemAsync: async (key) => {
        storage.delete(key);
      },
    },
    '@/lib/react-query': { queryClient: { clear() {} } },
  };
  const modules = new Map();
  function load(file) {
    const path = resolve(root, file);
    if (modules.has(path)) return modules.get(path);
    if (!compiled.has(path))
      compiled.set(
        path,
        ts.transpileModule(readFileSync(path, 'utf8'), {
          compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
          fileName: path,
        }).outputText,
      );
    const exports = {};
    modules.set(path, exports);
    const require = (name) => {
      if (Object.hasOwn(dependencies, name)) return dependencies[name];
      if (name.startsWith('@/')) return load(`${name.slice(2)}.ts`);
      if (name.startsWith('.')) return load(resolve(dirname(path), `${name}.ts`));
      throw new Error(`Unexpected dependency ${name}`);
    };
    new Function('require', 'exports', compiled.get(path))(require, exports);
    return exports;
  }
  return {
    requests,
    storage,
    ...load('services/api.ts'),
    ...load('services/auth/auth.session.ts'),
    ...load('services/auth/auth.service.ts'),
  };
}

for (const [name, baseUrl, expected] of [
  [
    'surrounding whitespace and trailing slashes',
    ' https://identity.test/api/// ',
    'https://identity.test/api',
  ],
  [
    'long trailing slash run',
    `https://identity.test/${'/'.repeat(100000)}`,
    'https://identity.test',
  ],
  [
    'long internal slash run',
    `https://identity.test/${'/'.repeat(100000)}users`,
    `https://identity.test/${'/'.repeat(100000)}users`,
  ],
]) {
  test(`API base URL preserves its path when normalizing ${name}`, async () => {
    const auth = setup((config) => response(config, { ok: true }));
    await auth.createApiClient({ baseUrl, includeAuth: false }).get('/api/Recipe');
    assert.equal(auth.requests.length, 1);
    assert.equal(auth.requests[0].baseURL, expected);
    assert.equal(auth.requests[0].url, '/api/Recipe');
  });
}

test('missing API configuration reports an actionable error without making a request', async () => {
  const previous = process.env.EXPO_PUBLIC_API_URL;
  delete process.env.EXPO_PUBLIC_API_URL;
  try {
    const auth = setup(() => assert.fail('Should not send request'));
    await assert.rejects(
      auth.createApiClient({ includeAuth: false }).post('/api/auth/login'),
      (error) => {
        assert.equal(error.name, 'ApiConfigurationError');
        assert.equal(error.status, 0);
        assert.ok(error.message.includes('EXPO_PUBLIC_API_URL'));
        assert.equal(error.displayMessage.includes('EXPO_PUBLIC_API_URL'), false);
        return true;
      },
    );
    assert.equal(auth.requests.length, 0);
  } finally {
    if (previous === undefined) delete process.env.EXPO_PUBLIC_API_URL;
    else process.env.EXPO_PUBLIC_API_URL = previous;
  }
});

test('login requests omit bearer credentials and do not refresh invalid credentials', async () => {
  const auth = setup((config) => reject(config, 401, { code: 'INVALID_CREDENTIALS' }));
  await auth.establishAuthSession(token(), 0);
  const client = auth.createApiClient({
    baseUrl: 'https://identity.test',
    includeAuth: false,
    skipInterceptor: true,
  });
  await assert.rejects(
    client.post('/api/auth/login', { login: 'alice', password: 'password' }),
    (error) => auth.getAuthErrorMessage(error).includes('incorrect'),
  );
  assert.equal(auth.requests.length, 1);
  assert.equal(auth.requests[0].headers.get('Authorization'), undefined);
  assert.equal((await auth.getAuthSession()).accessToken, 'old');
});

test('concurrent expired-token requests rotate once and retry with the new bearer token', async () => {
  const refreshStarted = deferred();
  const release = deferred();
  const auth = setup(async (config) => {
    if (config.url === '/api/auth/token/refresh') {
      refreshStarted.resolve();
      await release.promise;
      return response(config, token('new'));
    }
    if (config.headers.get('Authorization') === 'Bearer old')
      return reject(config, 401, { code: 'TOKEN_EXPIRED' });
    return response(config, { userId: 'alice' });
  });
  await auth.establishAuthSession(token(), 0);
  const client = auth.createApiClient({ baseUrl: 'https://identity.test' });
  const one = client.get('/api/users/me');
  const two = client.get('/api/users/me');
  await refreshStarted.promise;
  release.resolve();
  assert.deepEqual(await Promise.all([one, two]), [{ userId: 'alice' }, { userId: 'alice' }]);
  assert.equal(
    auth.requests.filter((config) => config.url === '/api/auth/token/refresh').length,
    1,
  );
  assert.equal(await auth.getAccessToken(), 'new');
});

test('a late 401 retries an already rotated token without rotating again', async () => {
  const late = deferred();
  const started = deferred();
  const auth = setup(async (config) => {
    if (config.url === '/api/auth/token/refresh') return response(config, token('new'));
    if (config.url === '/late' && !config._retry) {
      started.resolve();
      await late.promise;
      return reject(config, 401, { code: 'TOKEN_EXPIRED' });
    }
    if (config.headers.get('Authorization') === 'Bearer old')
      return reject(config, 401, { code: 'TOKEN_EXPIRED' });
    return response(config, 'ok');
  });
  await auth.establishAuthSession(token(), 0);
  const client = auth.createApiClient({ baseUrl: 'https://identity.test' });
  const pending = client.get('/late');
  await started.promise;
  assert.equal(await client.get('/first'), 'ok');
  late.resolve();
  assert.equal(await pending, 'ok');
  assert.equal(
    auth.requests.filter((config) => config.url === '/api/auth/token/refresh').length,
    1,
  );
});

test('logout prevents an old successful response from returning account data', async () => {
  const started = deferred();
  const release = deferred();
  const auth = setup(async (config) => {
    started.resolve();
    await release.promise;
    return response(config, { private: 'alice' });
  });
  await auth.establishAuthSession(token(), 0);
  const pending = auth.createApiClient({ baseUrl: 'https://identity.test' }).get('/api/users/me');
  const rejected = assert.rejects(pending, /session changed/);
  await started.promise;
  await auth.clearAuthSession();
  release.resolve();
  await rejected;
  assert.equal(await auth.getAuthSession(), null);
});

test('explicit invalid-session response removes credentials without refreshing', async () => {
  const auth = setup((config) => reject(config, 401, { code: 'ACCESS_SESSION_INVALID' }));
  await auth.establishAuthSession(token(), 0);
  await assert.rejects(
    auth.createApiClient({ baseUrl: 'https://identity.test' }).get('/api/users/me'),
  );
  assert.equal(auth.requests.length, 1);
  assert.equal(await auth.getAuthSession(), null);
});

test('API requests forward query cancellation signals to Axios', async () => {
  const controller = new AbortController();
  const auth = setup((config) => {
    assert.equal(config.signal, controller.signal);
    return response(config, { items: [] });
  });
  await auth
    .createApiClient({ baseUrl: 'https://api.example.test', includeAuth: false })
    .get('/api/Recipe', { signal: controller.signal });
  controller.abort();
  await assert.rejects(
    auth
      .createApiClient({ baseUrl: 'https://api.example.test', includeAuth: false })
      .get('/api/Recipe', { signal: controller.signal }),
  );
  assert.equal(auth.requests.length, 1);
});
