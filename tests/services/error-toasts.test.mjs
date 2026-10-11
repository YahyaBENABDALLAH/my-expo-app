import assert from 'node:assert/strict';
import test from 'node:test';
import { AxiosError, CanceledError, isCancel } from 'axios';
import { CancelledError, QueryObserver } from '@tanstack/react-query';
import * as query from '@tanstack/react-query';
import { createSourceLoader } from '../helpers/load-source.mjs';
import { createApiHarness, deferred } from '../helpers/api-harness.mjs';

function setup() {
  const load = createSourceLoader({ '@tanstack/react-query': query });
  const toasts = load('lib/error-toasts.ts');
  const { ApiError } = load('services/api.error.ts');
  const { SessionChangedError } = load('services/auth/auth.errors.ts');
  return { load, toasts, ApiError, SessionChangedError };
}

test('toasts use API display messages, retain queued errors and coalesce parallel failures', () => {
  const { toasts, ApiError } = setup();
  let notifications = 0;
  const unsubscribe = toasts.subscribeErrorToasts(() => notifications++);
  const failure = () =>
    new ApiError('HTTP 422', 422, null, ['Title is required.', 'Choose a unit.']);
  toasts.reportErrorToast(failure());
  const first = toasts.getErrorToast();
  assert.equal(first.message, 'Title is required.\nChoose a unit.');
  toasts.reportErrorToast(failure());
  assert.equal(notifications, 1);
  toasts.reportErrorToast(new ApiError('HTTP 403', 403, null, 'You cannot edit this recipe.'));
  assert.equal(toasts.getErrorToast(), first);
  toasts.dismissErrorToast(first.id);
  const next = toasts.getErrorToast();
  assert.equal(next.message, 'You cannot edit this recipe.');
  toasts.dismissErrorToast(first.id);
  assert.equal(toasts.getErrorToast(), next);
  toasts.dismissErrorToast(next.id);
  assert.equal(toasts.getErrorToast(), null);
  // A deliberate retry can report the same message after it has been dismissed.
  toasts.reportErrorToast(failure());
  assert.equal(toasts.getErrorToast().message, first.message);
  unsubscribe();
});

test('credential errors get friendly text; aborts and old sessions never show toasts', () => {
  const { toasts, ApiError, SessionChangedError } = setup();
  for (const error of [
    new CanceledError(),
    new CancelledError(),
    new DOMException('Aborted', 'AbortError'),
    new SessionChangedError(),
  ]) {
    toasts.reportErrorToast(error);
  }
  assert.equal(toasts.getErrorToast(), null);
  toasts.reportErrorToast(
    new ApiError('HTTP 401', 401, { code: 'INVALID_CREDENTIALS' }, 'Unauthorized'),
  );
  assert.equal(toasts.getErrorToast().message, 'The email/username or password is incorrect.');
});

test('shared queries show one toast after retries exhaust and retain saved content', async () => {
  const { load, toasts, ApiError } = setup();
  const { queryClient: client } = load('lib/react-query.ts');
  const firstFailure = deferred();
  const finalFailure = deferred();
  const retryStarted = deferred();
  const key = ['toast-query'];
  client.setQueryData(key, ['saved recipe']);
  let attempts = 0;
  const options = {
    queryKey: key,
    enabled: false,
    retryDelay: 0,
    queryFn: () => {
      if (++attempts === 1) return firstFailure.promise;
      retryStarted.resolve();
      return finalFailure.promise;
    },
  };
  const observer = new QueryObserver(client, options);
  const otherObserver = new QueryObserver(client, options);
  const unsubscribe = observer.subscribe(() => {});
  const unsubscribeOther = otherObserver.subscribe(() => {});
  try {
    const result = observer.refetch();
    const otherResult = otherObserver.refetch({ cancelRefetch: false });
    firstFailure.resolve(Promise.reject(new ApiError('First attempt', 503, null, 'Unavailable')));
    await retryStarted.promise;
    assert.equal(toasts.getErrorToast(), null);
    finalFailure.resolve(Promise.reject(new ApiError('Final attempt', 503, null, 'Unavailable')));
    await Promise.all([result, otherResult]);
    assert.equal(attempts, 2);
    assert.equal(toasts.getErrorToast().message, 'Unable to reach the service. Please try again.');
    assert.deepEqual(client.getQueryData(key), ['saved recipe']);
    const id = toasts.getErrorToast().id;
    toasts.dismissErrorToast(id);
    assert.equal(toasts.getErrorToast(), null);
  } finally {
    unsubscribe();
    unsubscribeOther();
    client.clear();
  }
});

test('a successful query retry produces no toast', async () => {
  const { load, toasts, ApiError } = setup();
  const { queryClient: client } = load('lib/react-query.ts');
  let attempts = 0;
  try {
    assert.equal(
      await client.fetchQuery({
        queryKey: ['retry-success'],
        retryDelay: 0,
        queryFn: () => {
          if (++attempts === 1) throw new ApiError('Temporary failure', 503, null, 'Unavailable');
          return 'recipe';
        },
      }),
      'recipe',
    );
    assert.equal(attempts, 2);
    assert.equal(toasts.getErrorToast(), null);
  } finally {
    client.clear();
  }
});

test('global mutation reporting survives a local onError and filters canceled operations', async () => {
  const { load, toasts, ApiError, SessionChangedError } = setup();
  const { queryClient: client } = load('lib/react-query.ts');
  const failure = new ApiError('HTTP 409', 409, null, 'This profile already exists.');
  let callbackError;
  try {
    const mutation = client.getMutationCache().build(client, {
      mutationFn: async () => {
        throw failure;
      },
      onError: (error) => {
        callbackError = error;
      },
    });
    await assert.rejects(mutation.execute(), (error) => error === failure);
    assert.equal(callbackError, failure);
    assert.equal(toasts.getErrorToast().message, 'This profile already exists.');
    toasts.dismissErrorToast(toasts.getErrorToast().id);
    for (const error of [new CanceledError(), new CancelledError(), new SessionChangedError()]) {
      const canceled = client.getMutationCache().build(client, {
        mutationFn: async () => {
          throw error;
        },
      });
      await assert.rejects(canceled.execute());
      assert.equal(toasts.getErrorToast(), null);
    }
  } finally {
    client.clear();
  }
});

test('Axios preserves canceled and obsolete-session errors instead of wrapping them as API failures', async () => {
  const s = createApiHarness();
  const { apiClient } = s.load('services/api.ts');
  const controller = new AbortController();
  controller.abort();
  await assert.rejects(apiClient.get('/api/Recipe', { signal: controller.signal }), isCancel);
  assert.equal(s.requests.length, 0);
  const { SessionChangedError } = s.load('services/auth/auth.errors.ts');
  const stale = new SessionChangedError();
  const oldSession = createApiHarness(
    () => {
      throw stale;
    },
    {
      'services/auth/auth.errors.ts': { SessionChangedError, isSessionInvalid: () => false },
    },
  );
  await assert.rejects(
    oldSession.load('services/api.ts').apiClient.get('/api/Recipe'),
    (error) => error === stale,
  );
});

test('best-effort sign-out and background refresh report failures without changing auth behavior', async () => {
  const failure = new AxiosError('Offline', 'ERR_NETWORK');
  let cleared = 0;
  const load = createSourceLoader({
    'services/auth/auth.api.ts': {
      logout: async () => {
        throw failure;
      },
    },
    'services/auth/auth.refresh.ts': {
      requestNewToken: async () => {
        throw failure;
      },
    },
    'services/auth/auth.session.ts': {
      getSessionVersion: () => 1,
      getAuthSession: async () => ({ expiresAtUtc: '2000-01-01T00:00:00Z' }),
      clearAuthSession: async () => {
        cleared++;
      },
    },
  });
  const auth = load('services/auth/auth.lifecycle.ts');
  const toasts = load('lib/error-toasts.ts');
  await auth.signOut();
  assert.equal(cleared, 1);
  assert.ok(toasts.getErrorToast());
  toasts.dismissErrorToast(toasts.getErrorToast().id);
  assert.ok(await auth.restoreSession());
  await new Promise((resolve) => setImmediate(resolve));
  assert.ok(toasts.getErrorToast());
});
