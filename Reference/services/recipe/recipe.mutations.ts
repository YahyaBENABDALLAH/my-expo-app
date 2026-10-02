import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRecipeData } from "./recipe.service";
import { recipeKeys } from "./recipe.queries";
import type { CreateRecipeBody } from "@/types/recipe.types";

// ── Create Recipe Mutation ───────────────────────────────────

interface CreateRecipeMutationArgs {
  chefUuid: string;
  body: CreateRecipeBody;
}

export function useCreateRecipeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ chefUuid, body }: CreateRecipeMutationArgs) =>
      createRecipeData(chefUuid, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recipeKeys.all });
    },
  });
}
