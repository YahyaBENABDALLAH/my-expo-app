import type { QueryClient } from '@tanstack/react-query';
import { dailyRecipeStatKeys, recipeKeys } from '@/lib/api-query-keys';
import type { CreateRecipeBody } from '@/types/recipe.types';
import { invalidateEntityLists } from '../query-invalidation';
import { sessionMutationOptions } from '../session-mutation';
import { recipeService } from './recipe.service';

export type CreateRecipeVariables = { chefUuid: string; body: CreateRecipeBody };

export function createRecipeMutationOptions(client: QueryClient) {
  return sessionMutationOptions(
    recipeKeys.mutation('create'),
    ({ chefUuid, body }: CreateRecipeVariables) => recipeService.create(chefUuid, body),
    async (recipe, _variables, assertCurrent) => {
      const queryKey = recipeKeys.detail(recipe.uuid);
      await client.cancelQueries({ queryKey, exact: true });
      assertCurrent();
      client.setQueryData(queryKey, recipe);
      await Promise.all([
        invalidateEntityLists(client, recipeKeys),
        client.invalidateQueries({ queryKey: dailyRecipeStatKeys.all }),
      ]);
    },
  );
}
