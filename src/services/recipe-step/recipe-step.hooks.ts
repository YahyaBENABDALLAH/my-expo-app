import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useEntityInvalidation } from '../query-hooks';
import type { QuerySettings } from '../query-utils';
import type { RecipeStepListQuery } from '@/types/recipe-step.types';
import {
  recipeStepDetailOptions,
  recipeStepInfiniteOptions,
  recipeStepKeys,
  recipeStepListOptions,
} from './recipe-step.queries';

export function useRecipeStepListQuery(
  query: RecipeStepListQuery = {},
  { enabled = true }: QuerySettings = {},
) {
  return useQuery({ ...recipeStepListOptions(query), enabled });
}

export function useRecipeStepInfiniteQuery(
  query: Omit<RecipeStepListQuery, 'page'> = {},
  { enabled = true }: QuerySettings = {},
) {
  return useInfiniteQuery({ ...recipeStepInfiniteOptions(query), enabled });
}

export function useRecipeStepDetailQuery(uuid?: string | null) {
  return useQuery(recipeStepDetailOptions(uuid));
}

export function useInvalidateRecipeStepQueries() {
  return useEntityInvalidation(recipeStepKeys);
}
