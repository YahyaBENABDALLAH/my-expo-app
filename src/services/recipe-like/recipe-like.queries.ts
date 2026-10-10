import { recipeLikeKeys } from '@/lib/api-query-keys';
import { detailQueryOptions, infiniteListQueryOptions, listQueryOptions } from '../query-utils';
import type { RecipeLikeListQuery } from '@/types/recipe-like.types';
import { recipeLikeService } from './recipe-like.service';

export { recipeLikeKeys } from '@/lib/api-query-keys';

export function recipeLikeListOptions(query: RecipeLikeListQuery = {}) {
  return listQueryOptions(recipeLikeKeys, query, recipeLikeService.list, 60000, {});
}

export function recipeLikeInfiniteOptions(query: Omit<RecipeLikeListQuery, 'page'> = {}) {
  return infiniteListQueryOptions(recipeLikeKeys, query, recipeLikeService.list, 60000, {});
}

export function recipeLikeDetailOptions(recipeUuid?: string | null, userUuid?: string | null) {
  return detailQueryOptions(
    recipeLikeKeys,
    [recipeUuid, userUuid],
    (ids, options) => recipeLikeService.detail(ids[0], ids[1], options),
    60000,
  );
}
