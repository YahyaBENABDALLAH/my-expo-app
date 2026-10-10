import { recipeStepKeys } from '@/lib/api-query-keys';
import { detailQueryOptions, infiniteListQueryOptions, listQueryOptions } from '../query-utils';
import type { RecipeStepListQuery } from '@/types/recipe-step.types';
import { recipeStepService } from './recipe-step.service';

export { recipeStepKeys } from '@/lib/api-query-keys';

export function recipeStepListOptions(query: RecipeStepListQuery = {}) {
  return listQueryOptions(recipeStepKeys, query, recipeStepService.list, 60000, {});
}

export function recipeStepInfiniteOptions(query: Omit<RecipeStepListQuery, 'page'> = {}) {
  return infiniteListQueryOptions(recipeStepKeys, query, recipeStepService.list, 60000, {});
}

export function recipeStepDetailOptions(uuid?: string | null) {
  return detailQueryOptions(
    recipeStepKeys,
    [uuid],
    (ids, options) => recipeStepService.detail(ids[0], options),
    60000,
  );
}
