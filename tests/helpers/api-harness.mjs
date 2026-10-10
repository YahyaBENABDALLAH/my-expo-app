import * as axios from 'axios';
import * as query from '@tanstack/react-query';
import { createSourceLoader } from './load-source.mjs';
import { recipeFixture } from './api-fixtures.mjs';

export function page(data = [recipeFixture()], number = 1, hasNextPage = false) {
  return {
    data,
    meta: {
      page: number,
      take: 12,
      itemCount: data.length,
      pageCount: hasNextPage ? number + 1 : number,
      hasPreviousPage: number > 1,
      hasNextPage,
    },
  };
}

export function deferred() {
  let resolve;
  const promise = new Promise((yes) => {
    resolve = yes;
  });
  return { promise, resolve };
}

/** Real Axios client and TanStack cache; only the network adapter and auth storage are replaced. */
export function createApiHarness(handler = () => page(), extraMocks = {}) {
  process.env.EXPO_PUBLIC_API_URL = 'https://api.example.test';
  const requests = [];
  let version = 1;
  const authUpdates = [];
  const assertSessionVersion = (expected) => {
    if (expected !== version) throw new Error('Session changed.');
  };
  const client = new query.QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: Infinity },
      mutations: { retry: false, gcTime: Infinity },
    },
  });
  const load = createSourceLoader({
    '@tanstack/react-query': query,
    axios: {
      ...axios,
      create: (options) =>
        axios.create({
          ...options,
          adapter: async (config) => {
            const request = {
              method: config.method.toUpperCase(),
              path: config.url,
              params: config.params,
              body: typeof config.data === 'string' ? JSON.parse(config.data) : config.data,
              signal: config.signal,
              timeout: config.timeout,
              headers: config.headers,
            };
            requests.push(request);
            const data = await handler(request, requests.length);
            return { config, data, status: 200, statusText: 'OK', headers: {} };
          },
        }),
    },
    'services/auth/auth.session.ts': {
      getSessionVersion: () => version,
      assertSessionVersion,
      getAccessToken: async () => 'test-token',
      clearAuthSession: async () => {},
      updateAuthUser: async (updates, expected) => {
        assertSessionVersion(expected);
        authUpdates.push(updates);
      },
    },
    ...extraMocks,
  });
  return {
    load,
    client,
    requests,
    authUpdates,
    changeSession: () => {
      version++;
      client.clear();
    },
    execute: (options, variables) =>
      client.getMutationCache().build(client, options).execute(variables),
  };
}
