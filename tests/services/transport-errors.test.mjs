import assert from 'node:assert/strict';
import test from 'node:test';
import { AxiosError, CanceledError } from 'axios';
import { createApiHarness } from '../helpers/api-harness.mjs';

for (const code of ['ECONNABORTED', 'ETIMEDOUT']) {
  test(`${code}: custom timeouts preserve the configured duration and retry a read once`, async () => {
    const s = createApiHarness((request) => {
      throw new AxiosError('Request timed out', code, { timeout: request.timeout });
    });
    const api = s.load('services/api.ts').createApiClient({ includeAuth: false });
    const { queryClient: client } = s.load('lib/react-query.ts');
    const i18n = s.load('lib/i18n.ts').default;
    try {
      await assert.rejects(
        client.fetchQuery({
          queryKey: ['timeout', code],
          retryDelay: 0,
          queryFn: () => api.get('/api/Recipe', { timeoutMs: 2500 }),
        }),
        (error) => {
          assert.equal(error.kind, 'timeout');
          assert.equal(error.status, 0);
          assert.equal(error.message, 'API request timed out after 2500ms');
          assert.equal(error.displayMessage, i18n.t('api.timeout'));
          return true;
        },
      );
      assert.deepEqual(
        s.requests.map((request) => request.timeout),
        [2500, 2500],
      );
      assert.equal(client.getQueryData(['timeout', code]), undefined);
    } finally {
      client.clear();
      s.client.clear();
    }
  });
}

for (const code of ['ERR_NETWORK', 'ECONNRESET', 'ENOTFOUND']) {
  test(`${code}: genuine connection failures get one read retry and localized feedback`, async () => {
    const s = createApiHarness(() => {
      throw new AxiosError('Internal connection diagnostic', code);
    });
    const api = s.load('services/api.ts').createApiClient({ includeAuth: false });
    const { queryClient: client } = s.load('lib/react-query.ts');
    try {
      await assert.rejects(
        client.fetchQuery({
          queryKey: ['network', code],
          retryDelay: 0,
          queryFn: () => api.get('/api/Recipe'),
        }),
        (error) => {
          assert.equal(error.kind, 'network');
          assert.equal(error.message, 'Internal connection diagnostic');
          assert.equal(error.displayMessage, s.load('lib/i18n.ts').default.t('api.network'));
          return true;
        },
      );
      assert.equal(s.requests.length, 2);
    } finally {
      client.clear();
      s.client.clear();
    }
  });
}

for (const [code, kind] of [
  ['ERR_BAD_OPTION_VALUE', 'configuration'],
  ['ERR_BAD_OPTION', 'configuration'],
  ['ERR_INVALID_URL', 'configuration'],
  ['ERR_NOT_SUPPORT', 'configuration'],
  ['ERR_BAD_RESPONSE', 'unexpected'],
  ['ERR_FR_TOO_MANY_REDIRECTS', 'unexpected'],
  ['ECONNABORTED', 'unexpected'],
  [undefined, 'unexpected'],
]) {
  test(`${code ?? 'unknown Axios failure'}: setup and protocol errors never restart a read`, async () => {
    const diagnostic = 'Internal setup or protocol detail';
    const s = createApiHarness(() => {
      throw new AxiosError(diagnostic, code);
    });
    const api = s.load('services/api.ts').createApiClient({ includeAuth: false });
    const { queryClient: client } = s.load('lib/react-query.ts');
    try {
      await assert.rejects(
        client.fetchQuery({
          queryKey: ['setup', code],
          retryDelay: 0,
          queryFn: () => api.get('/api/Recipe'),
        }),
        (error) => {
          assert.equal(error.kind, kind);
          assert.equal(error.message, diagnostic);
          assert.equal(error.displayMessage, s.load('lib/i18n.ts').default.t('auth.requestFailed'));
          return true;
        },
      );
      assert.equal(s.requests.length, 1);
    } finally {
      client.clear();
      s.client.clear();
    }
  });
}

test('preflight storage failures are not connection errors or user-facing diagnostics', async () => {
  const diagnostic = new TypeError('Secure storage implementation failed');
  let attempts = 0;
  const s = createApiHarness(undefined, {
    'services/auth/auth.session.ts': {
      getSessionVersion: () => 1,
      assertSessionVersion: () => {},
      getAccessToken: async () => {
        attempts++;
        throw diagnostic;
      },
    },
  });
  const api = s.load('services/api.ts').apiClient;
  const { queryClient: client } = s.load('lib/react-query.ts');
  try {
    await assert.rejects(
      client.fetchQuery({
        queryKey: ['storage-failure'],
        retryDelay: 0,
        queryFn: () => api.get('/api/Recipe'),
      }),
      (error) => {
        assert.equal(error.kind, 'unexpected');
        assert.equal(error.message, diagnostic.message);
        assert.equal(error.displayMessage, s.load('lib/i18n.ts').default.t('auth.requestFailed'));
        return true;
      },
    );
    assert.equal(attempts, 1);
    assert.equal(s.requests.length, 0);
    assert.equal(client.getQueryData(['storage-failure']), undefined);
  } finally {
    client.clear();
    s.client.clear();
  }
});

test('transport preserves cancellation identities and imperative notifications remain silent', async () => {
  for (const failure of [new CanceledError(), new DOMException('Canceled', 'AbortError')]) {
    const s = createApiHarness(() => {
      throw failure;
    });
    const api = s.load('services/api.ts').createApiClient({ includeAuth: false });
    const toasts = s.load('lib/error-toasts.ts');
    await assert.rejects(api.get('/api/Recipe'), (error) => {
      assert.equal(error, failure);
      toasts.reportErrorToast(error);
      return true;
    });
    assert.equal(toasts.getErrorToast(), null);
    s.client.clear();
  }
});

test('a null transport rejection gets safe feedback without crashing error normalization', async () => {
  const s = createApiHarness(() => {
    throw null;
  });
  const api = s.load('services/api.ts').createApiClient({ includeAuth: false });
  await assert.rejects(api.get('/api/Recipe'), (error) => {
    assert.equal(error.kind, 'unexpected');
    assert.equal(error.message, 'API request failed before receiving a response');
    assert.equal(error.displayMessage, s.load('lib/i18n.ts').default.t('auth.requestFailed'));
    return true;
  });
  s.client.clear();
});

test('HTTP validation messages retain meaningful strings without rendering invalid message objects', async () => {
  const data = {
    message: ['', null, { detail: 'not a message' }],
    errors: { title: [' Required ', {}, 7], unit: null },
  };
  const s = createApiHarness(() => {
    throw new AxiosError('Request failed', 'ERR_BAD_REQUEST', undefined, undefined, {
      status: 422,
      data,
    });
  });
  const api = s.load('services/api.ts').createApiClient({ includeAuth: false });
  await assert.rejects(api.get('/api/Recipe'), (error) => {
    assert.equal(error.kind, 'http');
    assert.equal(error.status, 422);
    assert.equal(error.data, data);
    assert.deepEqual(error.displayMessage, ['Required']);
    return true;
  });
  s.client.clear();
});
