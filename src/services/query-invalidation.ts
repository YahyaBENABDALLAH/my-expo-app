import type { QueryClient } from '@tanstack/react-query';
import type { EntityKeys } from '@/lib/api-query-keys';

export type RefetchSettings = { refetchType?: 'active' | 'inactive' | 'all' | 'none' };

export function invalidateEntityLists(
  client: QueryClient,
  keys: EntityKeys,
  settings: RefetchSettings = {},
) {
  return Promise.all([
    client.invalidateQueries({ queryKey: keys.lists, ...settings }),
    client.invalidateQueries({ queryKey: keys.infiniteLists, ...settings }),
  ]).then(() => {});
}

export function invalidateEntityDetail(
  client: QueryClient,
  keys: EntityKeys,
  ids: string[],
  settings: RefetchSettings = {},
) {
  return client.invalidateQueries({
    queryKey: keys.detail(...ids.map((id) => id.trim())),
    exact: true,
    ...settings,
  });
}
