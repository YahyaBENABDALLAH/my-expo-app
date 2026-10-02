import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getRecipeLikeDetailData, getRecipeLikeListData } from "./recipe-like.service";
import type { RecipeLikeListQuery } from "@/types/recipe-like.types";

export const recipeLikeKeys = {
  all: ["recipeLikes"] as const,
  list: (query: RecipeLikeListQuery) => ["recipeLikes", "list", query] as const,
  detail: (recipeUuid: string, userUuid: string) =>
    ["recipeLikes", "detail", recipeUuid, userUuid] as const,
};

export const getRecipeLikeListQueryOptions = (query: RecipeLikeListQuery = {}) => ({
  queryKey: recipeLikeKeys.list(query),
  queryFn: () => getRecipeLikeListData(query),
  placeholderData: keepPreviousData,
});

export const getRecipeLikeDetailQueryOptions = (recipeUuid: string, userUuid: string) => ({
  queryKey: recipeLikeKeys.detail(recipeUuid, userUuid),
  queryFn: () => getRecipeLikeDetailData(recipeUuid, userUuid),
  enabled:
    typeof recipeUuid === "string" &&
    recipeUuid.length > 0 &&
    typeof userUuid === "string" &&
    userUuid.length > 0,
  staleTime: 30_000,
});

export function useRecipeLikeListQuery(
  query: RecipeLikeListQuery = {},
  { enabled = true }: { enabled?: boolean } = {},
) {
  return useQuery({
    ...getRecipeLikeListQueryOptions(query),
    enabled,
  });
}

export function useRecipeLikeDetailQuery(recipeUuid: string, userUuid: string) {
  return useQuery(getRecipeLikeDetailQueryOptions(recipeUuid, userUuid));
}
