import { unitKeys } from '@/lib/api-query-keys';
import { detailQueryOptions, infiniteListQueryOptions, listQueryOptions } from '../query-utils';
import type { UnitListQuery } from '@/types/unit.types';
import { unitService } from './unit.service';

export { unitKeys } from '@/lib/api-query-keys';

export function unitListOptions(query: UnitListQuery = {}) {
  return listQueryOptions(unitKeys, query, unitService.list, 300000, { pageSize: 20 });
}

export function unitInfiniteOptions(query: Omit<UnitListQuery, 'page'> = {}) {
  return infiniteListQueryOptions(unitKeys, query, unitService.list, 300000, { pageSize: 20 });
}

export function unitDetailOptions(uuid?: string | null) {
  return detailQueryOptions(
    unitKeys,
    [uuid],
    (ids, options) => unitService.detail(ids[0], options),
    300000,
  );
}
