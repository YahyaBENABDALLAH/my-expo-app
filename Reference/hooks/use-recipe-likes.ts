import {
  useCreateRecipeLikeMutation,
  useDeleteRecipeLikeMutation,
} from "@/services/recipe-like/recipe-like.mutations";
import { useRecipeLikeListQuery } from "@/services/recipe-like/recipe-like.queries";
import { useCallback, useMemo } from "react";

interface UseRecipeLikesOptions {
  pageSize?: number;
  recipeUuid?: string;
  userUuid?: string | null;
}

export function useRecipeLikes({
  pageSize = 100,
  recipeUuid,
  userUuid,
}: UseRecipeLikesOptions) {
  const normalizedUserUuid = userUuid?.trim() || undefined;
  const likesQuery = useRecipeLikeListQuery(
    {
      pageSize,
      recipeUuid,
      userUuid: normalizedUserUuid,
    },
    { enabled: Boolean(normalizedUserUuid) },
  );
  const createLikeMutation = useCreateRecipeLikeMutation();
  const deleteLikeMutation = useDeleteRecipeLikeMutation();

  const likedRecipeUuids = useMemo(
    () =>
      (likesQuery.data?.data ?? [])
        .map((like) => like.recipeUuid)
        .filter((uuid): uuid is string => typeof uuid === "string"),
    [likesQuery.data?.data],
  );
  const likedRecipeUuidSet = useMemo(
    () => new Set(likedRecipeUuids),
    [likedRecipeUuids],
  );

  const isRecipeLiked = useCallback(
    (targetRecipeUuid: string) => likedRecipeUuidSet.has(targetRecipeUuid),
    [likedRecipeUuidSet],
  );

  const toggleLike = useCallback(
    (targetRecipeUuid: string) => {
      if (
        !normalizedUserUuid ||
        createLikeMutation.isPending ||
        deleteLikeMutation.isPending
      ) {
        return;
      }

      const variables = {
        recipeUuid: targetRecipeUuid,
        userUuid: normalizedUserUuid,
      };

      if (likedRecipeUuidSet.has(targetRecipeUuid)) {
        deleteLikeMutation.mutate(variables);
      } else {
        createLikeMutation.mutate(variables);
      }
    },
    [
      createLikeMutation,
      deleteLikeMutation,
      likedRecipeUuidSet,
      normalizedUserUuid,
    ],
  );

  return {
    error: likesQuery.error,
    isError: likesQuery.isError,
    isFetching: likesQuery.isFetching,
    isPending: Boolean(normalizedUserUuid) && likesQuery.isPending,
    isRecipeLiked,
    isToggling: createLikeMutation.isPending || deleteLikeMutation.isPending,
    likedRecipeUuids,
    refetch: likesQuery.refetch,
    toggleLike,
  };
}
