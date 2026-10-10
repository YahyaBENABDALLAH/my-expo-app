import { moroccanCityKeys } from '@/lib/api-query-keys';
import { detailQueryOptions, infiniteListQueryOptions, listQueryOptions } from '../query-utils';
import type { MoroccanCityListQuery } from '@/types/moroccan-city.types';
import { moroccanCityService } from './moroccan-city.service';

export { moroccanCityKeys } from '@/lib/api-query-keys';

export function moroccanCityListOptions(query: MoroccanCityListQuery = {}) {
  return listQueryOptions(moroccanCityKeys, query, moroccanCityService.list, 300000, {
    pageSize: 20,
  });
}

export function moroccanCityInfiniteOptions(query: Omit<MoroccanCityListQuery, 'page'> = {}) {
  return infiniteListQueryOptions(moroccanCityKeys, query, moroccanCityService.list, 300000, {
    pageSize: 20,
  });
}

export function moroccanCityDetailOptions(uuid?: string | null) {
  return detailQueryOptions(
    moroccanCityKeys,
    [uuid],
    (ids, options) => moroccanCityService.detail(ids[0], options),
    300000,
  );
}
