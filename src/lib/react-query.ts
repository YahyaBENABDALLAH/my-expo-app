import { isCancelledError, MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { reportErrorToast } from '@/lib/error-toasts';
import { ApiResponseValidationError } from '@/services/api.error';

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
      retry: (failureCount, error) =>
        !(error instanceof ApiResponseValidationError) && failureCount < 1,
      staleTime: ONE_MINUTE_MS,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
    },
    mutations: {
      retry: 0,
    },
  },
});
