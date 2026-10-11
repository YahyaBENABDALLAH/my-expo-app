import assert from 'node:assert/strict';
import test from 'node:test';
import { CanceledError } from 'axios';
import { CancelledError } from '@tanstack/react-query';
import { createSourceLoader } from '../helpers/load-source.mjs';
import { createApiHarness } from '../helpers/api-harness.mjs';

for (const status of [400, 401, 403, 404, 409, 422, 429, 501]) {
  test(`HTTP ${status}: deterministic failures are delivered without another request`, async () => {
    const load = createSourceLoader();
    const { queryClient: client } = load('lib/react-query.ts');
    const { ApiError } = load('services/api.error.ts');
    const error = new ApiError('Request failed', status, null, 'Request failed');
    let requests = 0;
    try {
      await assert.rejects(
        client.fetchQuery({
          queryKey: ['terminal', status],
          retryDelay: 0,
          queryFn: () => {
            requests++;
            throw error;
          },
        }),
        (failure) => failure === error,
      );
      assert.equal(requests, 1);
    } finally {
      client.clear();
    }
  });
}

for (const status of [0, 408, 500, 502, 503, 504]) {
  test(`HTTP ${status}: transient reads get one retry and retain existing data on final failure`, async () => {
    const load = createSourceLoader();
    const { queryClient: client } = load('lib/react-query.ts');
    const { ApiError } = load('services/api.error.ts');
    const key = ['transient', status];
    client.setQueryData(key, ['saved recipe']);
    let requests = 0;
    try {
      await assert.rejects(
        client.fetchQuery({
          queryKey: key,
          staleTime: 0,
          retryDelay: 0,
          queryFn: () => {
            requests++;
            throw new ApiError('Temporary failure', status, null, 'Unavailable');
          },
        }),
      );
      assert.equal(requests, 2);
      assert.deepEqual(client.getQueryData(key), ['saved recipe']);
    } finally {
      client.clear();
    }
  });
}

test('cancellation, obsolete sessions, invalid responses and programming errors never restart reads', async () => {
  const load = createSourceLoader();
  const { queryClient: client } = load('lib/react-query.ts');
  const { SessionChangedError } = load('services/auth/auth.errors.ts');
  const { ApiResponseValidationError } = load('services/api.error.ts');
  try {
    for (const error of [
      new CanceledError(),
      new CancelledError(),
      new SessionChangedError(),
      new ApiResponseValidationError(200),
      new TypeError('Invalid state'),
    ]) {
      let requests = 0;
      await assert.rejects(
        client.fetchQuery({
          queryKey: ['interrupted', error.name],
          retryDelay: 0,
          queryFn: () => {
            requests++;
            throw error;
          },
        }),
        (failure) => failure === error,
      );
      assert.equal(requests, 1);
    }
  } finally {
    client.clear();
  }
});

test('an empty API origin fails once as configuration, before transport or cache writes', async () => {
  const s = createApiHarness();
  const { queryClient: client } = s.load('lib/react-query.ts');
  const api = s.load('services/api.ts').createApiClient({ baseUrl: '   ', includeAuth: false });
  let attempts = 0;
  try {
    await assert.rejects(
      client.fetchQuery({
        queryKey: ['missing-api-origin'],
        retryDelay: 0,
        queryFn: () => {
          attempts++;
          return api.get('/api/Recipe');
        },
      }),
      (error) => error.name === 'ApiConfigurationError',
    );
    assert.equal(attempts, 1);
    assert.equal(s.requests.length, 0);
    assert.equal(client.getQueryData(['missing-api-origin']), undefined);
  } finally {
    client.clear();
    s.client.clear();
  }
});
