import { recipeKeys } from '@/lib/api-query-keys';
import { detailQueryOptions, infiniteListQueryOptions, listQueryOptions } from '../query-utils';
import type { RecipeListQuery } from '@/types/recipe.types';
import { recipeService } from './recipe.service';

export { recipeKeys } from '@/lib/api-query-keys';

export function recipeListOptions(query: RecipeListQuery = {}) {
  return listQueryOptions(recipeKeys, query, recipeService.list, 60000, {});
}

export function recipeInfiniteOptions(query: Omit<RecipeListQuery, 'page'> = {}) {
  return infiniteListQueryOptions(recipeKeys, query, recipeService.list, 60000, {});
}

export function recipeDetailOptions(uuid?: string | null) {
  return detailQueryOptions(
    recipeKeys,
    [uuid],
    (ids, options) => recipeService.detail(ids[0], options),
    60000,
  );
}
