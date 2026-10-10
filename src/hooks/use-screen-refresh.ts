import { useQueryClient, type QueryKey } from '@tanstack/react-query';
import { refetchScreenQueries } from '@/services/query-refresh';

export function useScreenRefresh(queryKeys: readonly QueryKey[]) {
  const client = useQueryClient();
  return () => refetchScreenQueries(client, queryKeys);
}
