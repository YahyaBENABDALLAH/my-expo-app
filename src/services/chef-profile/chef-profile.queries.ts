import { queryOptions, skipToken } from '@tanstack/react-query';
import { chefProfileKeys } from '@/lib/api-query-keys';
import { detailQueryOptions, infiniteListQueryOptions, listQueryOptions } from '../query-utils';
import type { ChefProfileListQuery } from '@/types/chef-profile.types';
import { chefProfileService } from './chef-profile.service';

export { chefProfileKeys } from '@/lib/api-query-keys';

export function chefProfileForUserOptions(userUuid?: string | null) {
  const id = userUuid?.trim() ?? '';
  return queryOptions({
    queryKey: chefProfileKeys.forUser(id),
    queryFn: id ? ({ signal }) => chefProfileService.forUser(id, { signal }) : skipToken,
    enabled: Boolean(id),
    staleTime: 60_000,
  });
}

export function chefProfileListOptions(query: ChefProfileListQuery = {}) {
  return listQueryOptions(chefProfileKeys, query, chefProfileService.list, 60000, {});
}

export function chefProfileInfiniteOptions(query: Omit<ChefProfileListQuery, 'page'> = {}) {
  return infiniteListQueryOptions(chefProfileKeys, query, chefProfileService.list, 60000, {});
}

export function chefProfileDetailOptions(uuid?: string | null) {
  return detailQueryOptions(
    chefProfileKeys,
    [uuid],
    (ids, options) => chefProfileService.detail(ids[0], options),
    60000,
  );
}
