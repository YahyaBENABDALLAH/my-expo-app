import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { reportErrorAlert } from '@/lib/error-alerts';
import { ApiError } from '@/services/api.error';

const ONE_MINUTE_MS = 60 * 1000;
const THIRTY_MINUTES_MS = 30 * ONE_MINUTE_MS;

export const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError: reportErrorAlert }),
  mutationCache: new MutationCache({ onError: reportErrorAlert }),
  defaultOptions: {
    queries: {
      gcTime: THIRTY_MINUTES_MS,
      // Retry transient reads once. Auth refresh is owned by the HTTP client;
      // invalid requests, stale sessions and programming errors need intervention.
      retry: (failureCount, error) =>
        failureCount < 1 &&
        error instanceof ApiError &&
        (error.kind === 'network' ||
          error.kind === 'timeout' ||
          (error.kind === 'http' && [408, 500, 502, 503, 504].includes(error.status))),
      staleTime: ONE_MINUTE_MS,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
    },
    mutations: {
      retry: 0,
    },
  },
});
