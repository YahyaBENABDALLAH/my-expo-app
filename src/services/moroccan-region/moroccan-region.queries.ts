import { moroccanRegionKeys } from '@/lib/api-query-keys';
import { detailQueryOptions, infiniteListQueryOptions, listQueryOptions } from '../query-utils';
import type { MoroccanRegionListQuery } from '@/types/moroccan-region.types';
import { moroccanRegionService } from './moroccan-region.service';

export { moroccanRegionKeys } from '@/lib/api-query-keys';

export function moroccanRegionListOptions(query: MoroccanRegionListQuery = {}) {
  return listQueryOptions(moroccanRegionKeys, query, moroccanRegionService.list, 300000, {
    pageSize: 20,
  });
}

export function moroccanRegionInfiniteOptions(query: Omit<MoroccanRegionListQuery, 'page'> = {}) {
  return infiniteListQueryOptions(moroccanRegionKeys, query, moroccanRegionService.list, 300000, {
    pageSize: 20,
  });
}

export function moroccanRegionDetailOptions(uuid?: string | null) {
  return detailQueryOptions(
    moroccanRegionKeys,
    [uuid],
    (ids, options) => moroccanRegionService.detail(ids[0], options),
    300000,
  );
}
