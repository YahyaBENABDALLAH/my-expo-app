import { isCancelledError, MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { reportErrorToast } from '@/lib/error-toasts';
import { ApiConfigurationError, ApiError, ApiResponseValidationError } from '@/services/api.error';

const ONE_MINUTE_MS = 60 * 1000;
const THIRTY_MINUTES_MS = 30 * ONE_MINUTE_MS;

function onError(error: unknown) {
  if (!isCancelledError(error)) reportErrorToast(error);
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({ onError }),
  mutationCache: new MutationCache({ onError }),
  defaultOptions: {
    queries: {
      gcTime: THIRTY_MINUTES_MS,
      // Retry transient reads once. Auth refresh is owned by the HTTP client;
      // invalid requests, stale sessions and programming errors need intervention.
      retry: (failureCount, error) =>
        failureCount < 1 &&
        error instanceof ApiError &&
        !(error instanceof ApiConfigurationError) &&
        !(error instanceof ApiResponseValidationError) &&
        (error.status === 0 || [408, 500, 502, 503, 504].includes(error.status)),
      staleTime: ONE_MINUTE_MS,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
    },
    mutations: {
      retry: 0,
    },
  },
});
