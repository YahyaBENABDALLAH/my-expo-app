import { recipeShareKeys } from '@/lib/api-query-keys';
import { detailQueryOptions, infiniteListQueryOptions, listQueryOptions } from '../query-utils';
import type { RecipeShareListQuery } from '@/types/recipe-share.types';
import { recipeShareService } from './recipe-share.service';

export { recipeShareKeys } from '@/lib/api-query-keys';

export function recipeShareListOptions(query: RecipeShareListQuery = {}) {
  return listQueryOptions(recipeShareKeys, query, recipeShareService.list, 60000, {});
}

export function recipeShareInfiniteOptions(query: Omit<RecipeShareListQuery, 'page'> = {}) {
  return infiniteListQueryOptions(recipeShareKeys, query, recipeShareService.list, 60000, {});
}

export function recipeShareDetailOptions(uuid?: string | null) {
  return detailQueryOptions(
    recipeShareKeys,
    [uuid],
    (ids, options) => recipeShareService.detail(ids[0], options),
    60000,
  );
}
