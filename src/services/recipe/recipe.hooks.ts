import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEntityInvalidation } from '../query-hooks';
import { withMutationCallbacks, type MutationCallbacks, type QuerySettings } from '../query-utils';
import type { RecipeItem, RecipeListQuery } from '@/types/recipe.types';
import { createRecipeMutationOptions, type CreateRecipeVariables } from './recipe.mutations';
import {
  recipeDetailOptions,
  recipeInfiniteOptions,
  recipeKeys,
  recipeListOptions,
} from './recipe.queries';

export function useRecipeListQuery(
  query: RecipeListQuery = {},
  { enabled = true }: QuerySettings = {},
) {
  return useQuery({ ...recipeListOptions(query), enabled });
}

export function useRecipeInfiniteQuery(
  query: Omit<RecipeListQuery, 'page'> = {},
  { enabled = true }: QuerySettings = {},
) {
  return useInfiniteQuery({ ...recipeInfiniteOptions(query), enabled });
}

export function useRecipeDetailQuery(uuid?: string | null) {
  return useQuery(recipeDetailOptions(uuid));
}

export function useInvalidateRecipeQueries() {
  return useEntityInvalidation(recipeKeys);
}

export function useCreateRecipeMutation(
  callbacks: MutationCallbacks<RecipeItem, CreateRecipeVariables> = {},
) {
  const client = useQueryClient();
  return useMutation(withMutationCallbacks(createRecipeMutationOptions(client), callbacks));
}
