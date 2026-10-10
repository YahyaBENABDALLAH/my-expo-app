import { recipeIngredientKeys } from '@/lib/api-query-keys';
import { detailQueryOptions, infiniteListQueryOptions, listQueryOptions } from '../query-utils';
import type { RecipeIngredientListQuery } from '@/types/recipe-ingredient.types';
import { recipeIngredientService } from './recipe-ingredient.service';

export { recipeIngredientKeys } from '@/lib/api-query-keys';

export function recipeIngredientListOptions(query: RecipeIngredientListQuery = {}) {
  return listQueryOptions(recipeIngredientKeys, query, recipeIngredientService.list, 60000, {});
}

export function recipeIngredientInfiniteOptions(
  query: Omit<RecipeIngredientListQuery, 'page'> = {},
) {
  return infiniteListQueryOptions(
    recipeIngredientKeys,
    query,
    recipeIngredientService.list,
    60000,
    {},
  );
}

export function recipeIngredientDetailOptions(
  recipeUuid?: string | null,
  ingredientUuid?: string | null,
) {
  return detailQueryOptions(
    recipeIngredientKeys,
    [recipeUuid, ingredientUuid],
    (ids, options) => recipeIngredientService.detail(ids[0], ids[1], options),
    60000,
  );
}
