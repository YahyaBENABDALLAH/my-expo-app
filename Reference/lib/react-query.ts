import { QueryClient } from "@tanstack/react-query";

const ONE_MINUTE_MS = 60 * 1000;
const THIRTY_MINUTES_MS = 30 * ONE_MINUTE_MS;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: THIRTY_MINUTES_MS,
      retry: 1,
      staleTime: ONE_MINUTE_MS,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
    },
    mutations: {
      retry: 0,
    },
  },
});
