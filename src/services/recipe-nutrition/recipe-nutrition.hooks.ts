import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useEntityInvalidation } from '../query-hooks';
import type { QuerySettings } from '../query-utils';
import type { RecipeNutritionListQuery } from '@/types/recipe-nutrition.types';
import {
  recipeNutritionDetailOptions,
  recipeNutritionInfiniteOptions,
  recipeNutritionKeys,
  recipeNutritionListOptions,
} from './recipe-nutrition.queries';

export function useRecipeNutritionListQuery(
  query: RecipeNutritionListQuery = {},
  { enabled = true }: QuerySettings = {},
) {
  return useQuery({ ...recipeNutritionListOptions(query), enabled });
}

export function useRecipeNutritionInfiniteQuery(
  query: Omit<RecipeNutritionListQuery, 'page'> = {},
  { enabled = true }: QuerySettings = {},
) {
  return useInfiniteQuery({ ...recipeNutritionInfiniteOptions(query), enabled });
}

export function useRecipeNutritionDetailQuery(recipeUuid?: string | null) {
  return useQuery(recipeNutritionDetailOptions(recipeUuid));
}

export function useInvalidateRecipeNutritionQueries() {
  return useEntityInvalidation(recipeNutritionKeys);
}
