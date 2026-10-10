import type { QueryClient, QueryKey } from '@tanstack/react-query';

/** Refetch only the exact, enabled query entries used by this screen. */
export async function refetchScreenQueries(client: QueryClient, queryKeys: readonly QueryKey[]) {
  await Promise.all(
    queryKeys.map((queryKey) =>
      client.refetchQueries({ queryKey, exact: true, type: 'active' }, { cancelRefetch: false }),
    ),
  );
}
