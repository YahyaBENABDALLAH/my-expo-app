import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRecipeLikeData, deleteRecipeLikeData } from "./recipe-like.service";
import { recipeLikeKeys } from "./recipe-like.queries";
import { recipeKeys } from "@/services/recipe/recipe.queries";
import type { CreateRecipeLikeBody } from "@/types/recipe-like.types";

export function useCreateRecipeLikeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateRecipeLikeBody) => createRecipeLikeData(body),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: recipeLikeKeys.all });
      if (data.recipeUuid) {
        void queryClient.invalidateQueries({
          queryKey: recipeKeys.detail(data.recipeUuid),
        });
      }
      void queryClient.invalidateQueries({ queryKey: recipeKeys.all });
    },
    onError: (error) => {
      console.error("[useCreateRecipeLikeMutation] Error creating recipe like:", error);
    },
  });
}

export function useDeleteRecipeLikeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ recipeUuid, userUuid }: { recipeUuid: string; userUuid: string }) =>
      deleteRecipeLikeData(recipeUuid, userUuid),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: recipeLikeKeys.all });
      void queryClient.invalidateQueries({
        queryKey: recipeKeys.detail(variables.recipeUuid),
      });
      void queryClient.invalidateQueries({ queryKey: recipeKeys.all });
    },
    onError: (error) => {
      console.error("[useDeleteRecipeLikeMutation] Error deleting recipe like:", error);
    },
  });
}
