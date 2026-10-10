import type { QueryClient } from '@tanstack/react-query';
import { dailyRecipeStatKeys, recipeKeys, recipeLikeKeys } from '@/lib/api-query-keys';
import type { CreateRecipeLikeBody } from '@/types/recipe-like.types';
import { invalidateEntityLists } from '../query-invalidation';
import { sessionMutationOptions } from '../session-mutation';
import { recipeLikeService } from './recipe-like.service';

export type RecipeLikeVariables = CreateRecipeLikeBody;

/** Match only lists which can contain this like, including unfiltered aggregate lists. */
export async function invalidateRecipeLikeChange(
  client: QueryClient,
  variables: RecipeLikeVariables,
) {
  const recipeUuid = variables.recipeUuid.trim();
  const userUuid = variables.userUuid.trim();
  await Promise.all([
    client.invalidateQueries({
      queryKey: recipeLikeKeys.all,
      predicate: ({ queryKey }) => {
        if (queryKey[1] === 'detail') return queryKey[2] === recipeUuid && queryKey[3] === userUuid;
        if (queryKey[1] !== 'list' && queryKey[1] !== 'infinite') return false;
        const filters = queryKey[2] as { userUuid?: string; recipeUuid?: string };
        return (
          (!filters.userUuid || filters.userUuid === userUuid) &&
          (!filters.recipeUuid || filters.recipeUuid === recipeUuid)
        );
      },
    }),
    invalidateEntityLists(client, recipeKeys),
    client.invalidateQueries({ queryKey: recipeKeys.detail(recipeUuid), exact: true }),
    client.invalidateQueries({ queryKey: dailyRecipeStatKeys.all }),
  ]);
}

export function createRecipeLikeMutationOptions(client: QueryClient) {
  return sessionMutationOptions(
    recipeLikeKeys.mutation('create'),
    (body: CreateRecipeLikeBody) => recipeLikeService.create(body),
    async (like, variables, assertCurrent) => {
      const queryKey = recipeLikeKeys.detail(
        variables.recipeUuid.trim(),
        variables.userUuid.trim(),
      );
      await client.cancelQueries({ queryKey, exact: true });
      assertCurrent();
      client.setQueryData(queryKey, like);
      await invalidateRecipeLikeChange(client, variables);
    },
  );
}

export function deleteRecipeLikeMutationOptions(client: QueryClient) {
  return sessionMutationOptions(
    recipeLikeKeys.mutation('delete'),
    ({ recipeUuid, userUuid }: RecipeLikeVariables) =>
      recipeLikeService.delete(recipeUuid, userUuid),
    async (_data, variables, assertCurrent) => {
      const queryKey = recipeLikeKeys.detail(
        variables.recipeUuid.trim(),
        variables.userUuid.trim(),
      );
      await client.cancelQueries({ queryKey, exact: true });
      assertCurrent();
      client.removeQueries({ queryKey, exact: true });
      await invalidateRecipeLikeChange(client, variables);
    },
  );
}
