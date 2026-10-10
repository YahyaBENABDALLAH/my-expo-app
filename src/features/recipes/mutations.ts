import { mutationOptions, type QueryClient } from '@tanstack/react-query';
import type { RecipeItem } from '@/types/recipe.types';
import type { RecipeLikeItem } from '@/types/recipe-like.types';
import { createRecipeMutationOptions } from '@/services/recipe/recipe.mutations';
import { createRecipeLikeMutationOptions } from '@/services/recipe-like/recipe-like.mutations';
import { recipeKeys } from './query-keys';
import { updateCollection, type CollectionKind } from './collections';
import type { recipeBody } from './recipe-draft';

export function createRecipeOptions(client: QueryClient, chefUuid: string) {
  const options = createRecipeMutationOptions(client);
  return mutationOptions<RecipeItem, Error, ReturnType<typeof recipeBody>>({
    mutationKey: options.mutationKey,
    networkMode: options.networkMode,
    retry: options.retry,
    mutationFn: (body: ReturnType<typeof recipeBody>, context) =>
      options.mutationFn!({ chefUuid, body }, context),
    onSuccess: (data, body, result, context) =>
      options.onSuccess?.(data, { chefUuid, body }, result, context),
  });
}

export function likeRecipeOptions(client: QueryClient, userUuid: string, recipeUuid: string) {
  const options = createRecipeLikeMutationOptions(client);
  const variables = { userUuid, recipeUuid };
  return mutationOptions<RecipeLikeItem, Error, void>({
    mutationKey: options.mutationKey,
    networkMode: options.networkMode,
    retry: options.retry,
    mutationFn: (_variables: void, context) => options.mutationFn!(variables, context),
    onSuccess: (data, _variables, result, context) =>
      options.onSuccess?.(data, variables, result, context),
  });
}

export function collectionMutationOptions(
  client: QueryClient,
  userUuid: string,
  kind: CollectionKind,
) {
  return mutationOptions({
    mutationFn: ({ recipe, remove = false }: { recipe?: RecipeItem; remove?: boolean }) =>
      updateCollection(userUuid, kind, recipe, remove),
    networkMode: 'always',
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: recipeKeys.collection(userUuid, kind) });
    },
  });
}
