import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEntityInvalidation } from '../query-hooks';
import { withMutationCallbacks, type MutationCallbacks, type QuerySettings } from '../query-utils';
import type { RecipeLikeItem, RecipeLikeListQuery } from '@/types/recipe-like.types';
import {
  createRecipeLikeMutationOptions,
  deleteRecipeLikeMutationOptions,
  type RecipeLikeVariables,
} from './recipe-like.mutations';
import {
  recipeLikeDetailOptions,
  recipeLikeInfiniteOptions,
  recipeLikeKeys,
  recipeLikeListOptions,
} from './recipe-like.queries';

export function useRecipeLikeListQuery(
  query: RecipeLikeListQuery = {},
  { enabled = true }: QuerySettings = {},
) {
  return useQuery({ ...recipeLikeListOptions(query), enabled });
}

export function useRecipeLikeInfiniteQuery(
  query: Omit<RecipeLikeListQuery, 'page'> = {},
  { enabled = true }: QuerySettings = {},
) {
  return useInfiniteQuery({ ...recipeLikeInfiniteOptions(query), enabled });
}

export function useRecipeLikeDetailQuery(recipeUuid?: string | null, userUuid?: string | null) {
  return useQuery(recipeLikeDetailOptions(recipeUuid, userUuid));
}

export function useInvalidateRecipeLikeQueries() {
  return useEntityInvalidation<[recipeUuid: string, userUuid: string]>(recipeLikeKeys);
}

export function useCreateRecipeLikeMutation(
  callbacks: MutationCallbacks<RecipeLikeItem, RecipeLikeVariables> = {},
) {
  const client = useQueryClient();
  return useMutation(withMutationCallbacks(createRecipeLikeMutationOptions(client), callbacks));
}

export function useDeleteRecipeLikeMutation(
  callbacks: MutationCallbacks<void, RecipeLikeVariables> = {},
) {
  const client = useQueryClient();
  return useMutation(withMutationCallbacks(deleteRecipeLikeMutationOptions(client), callbacks));
}
