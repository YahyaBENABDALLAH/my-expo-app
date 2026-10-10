import { difficultyKeys } from '@/lib/api-query-keys';
import { detailQueryOptions, infiniteListQueryOptions, listQueryOptions } from '../query-utils';
import type { DifficultyListQuery } from '@/types/difficulty.types';
import { difficultyService } from './difficulty.service';

export { difficultyKeys } from '@/lib/api-query-keys';

export function difficultyListOptions(query: DifficultyListQuery = {}) {
  return listQueryOptions(difficultyKeys, query, difficultyService.list, 300000, { pageSize: 20 });
}

export function difficultyInfiniteOptions(query: Omit<DifficultyListQuery, 'page'> = {}) {
  return infiniteListQueryOptions(difficultyKeys, query, difficultyService.list, 300000, {
    pageSize: 20,
  });
}

export function difficultyDetailOptions(uuid?: string | null) {
  return detailQueryOptions(
    difficultyKeys,
    [uuid],
    (ids, options) => difficultyService.detail(ids[0], options),
    300000,
  );
}
