import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useEntityInvalidation } from '../query-hooks';
import type { QuerySettings } from '../query-utils';
import type { RecipeShareListQuery } from '@/types/recipe-share.types';
import {
  recipeShareDetailOptions,
  recipeShareInfiniteOptions,
  recipeShareKeys,
  recipeShareListOptions,
} from './recipe-share.queries';

export function useRecipeShareListQuery(
  query: RecipeShareListQuery = {},
  { enabled = true }: QuerySettings = {},
) {
  return useQuery({ ...recipeShareListOptions(query), enabled });
}

export function useRecipeShareInfiniteQuery(
  query: Omit<RecipeShareListQuery, 'page'> = {},
  { enabled = true }: QuerySettings = {},
) {
  return useInfiniteQuery({ ...recipeShareInfiniteOptions(query), enabled });
}

export function useRecipeShareDetailQuery(uuid?: string | null) {
  return useQuery(recipeShareDetailOptions(uuid));
}

export function useInvalidateRecipeShareQueries() {
  return useEntityInvalidation(recipeShareKeys);
}
