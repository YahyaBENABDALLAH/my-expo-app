import { cuisineKeys } from '@/lib/api-query-keys';
import { detailQueryOptions, infiniteListQueryOptions, listQueryOptions } from '../query-utils';
import type { CuisineListQuery } from '@/types/cuisine.types';
import { cuisineService } from './cuisine.service';

export { cuisineKeys } from '@/lib/api-query-keys';

export function cuisineListOptions(query: CuisineListQuery = {}) {
  return listQueryOptions(cuisineKeys, query, cuisineService.list, 300000, { pageSize: 20 });
}

export function cuisineInfiniteOptions(query: Omit<CuisineListQuery, 'page'> = {}) {
  return infiniteListQueryOptions(cuisineKeys, query, cuisineService.list, 300000, {
    pageSize: 20,
  });
}

export function cuisineDetailOptions(uuid?: string | null) {
  return detailQueryOptions(
    cuisineKeys,
    [uuid],
    (ids, options) => cuisineService.detail(ids[0], options),
    300000,
  );
}
