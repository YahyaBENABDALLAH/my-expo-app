import { useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import type { EntityKeys } from '@/lib/api-query-keys';
import {
  invalidateEntityDetail,
  invalidateEntityLists,
  type RefetchSettings,
} from './query-invalidation';

/** Each hook uses its provider's QueryClient; no hidden global client. */
export function useEntityInvalidation<TIds extends string[] = [uuid: string]>(keys: EntityKeys) {
  const client = useQueryClient();
  return useMemo(
    () => ({
      all: (settings: RefetchSettings = {}) =>
        client.invalidateQueries({ queryKey: keys.all, ...settings }),
      lists: (settings: RefetchSettings = {}) => invalidateEntityLists(client, keys, settings),
      detail: (...ids: TIds) => invalidateEntityDetail(client, keys, ids),
    }),
    [client, keys],
  );
}
