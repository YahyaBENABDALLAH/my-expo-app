import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useEntityInvalidation } from '../query-hooks';
import type { QuerySettings } from '../query-utils';
import type { RecipeIngredientListQuery } from '@/types/recipe-ingredient.types';
import {
  recipeIngredientDetailOptions,
  recipeIngredientInfiniteOptions,
  recipeIngredientKeys,
  recipeIngredientListOptions,
} from './recipe-ingredient.queries';

export function useRecipeIngredientListQuery(
  query: RecipeIngredientListQuery = {},
  { enabled = true }: QuerySettings = {},
) {
  return useQuery({ ...recipeIngredientListOptions(query), enabled });
}

export function useRecipeIngredientInfiniteQuery(
  query: Omit<RecipeIngredientListQuery, 'page'> = {},
  { enabled = true }: QuerySettings = {},
) {
  return useInfiniteQuery({ ...recipeIngredientInfiniteOptions(query), enabled });
}

export function useRecipeIngredientDetailQuery(
  recipeUuid?: string | null,
  ingredientUuid?: string | null,
) {
  return useQuery(recipeIngredientDetailOptions(recipeUuid, ingredientUuid));
}

export function useInvalidateRecipeIngredientQueries() {
  return useEntityInvalidation<[recipeUuid: string, ingredientUuid: string]>(recipeIngredientKeys);
}
