import { recipeNutritionKeys } from '@/lib/api-query-keys';
import { detailQueryOptions, infiniteListQueryOptions, listQueryOptions } from '../query-utils';
import type { RecipeNutritionListQuery } from '@/types/recipe-nutrition.types';
import { recipeNutritionService } from './recipe-nutrition.service';

export { recipeNutritionKeys } from '@/lib/api-query-keys';

export function recipeNutritionListOptions(query: RecipeNutritionListQuery = {}) {
  return listQueryOptions(recipeNutritionKeys, query, recipeNutritionService.list, 60000, {});
}

export function recipeNutritionInfiniteOptions(query: Omit<RecipeNutritionListQuery, 'page'> = {}) {
  return infiniteListQueryOptions(
    recipeNutritionKeys,
    query,
    recipeNutritionService.list,
    60000,
    {},
  );
}

export function recipeNutritionDetailOptions(recipeUuid?: string | null) {
  return detailQueryOptions(
    recipeNutritionKeys,
    [recipeUuid],
    (ids, options) => recipeNutritionService.detail(ids[0], options),
    60000,
  );
}
