import { keepPreviousData, useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { getRecipeDetailData, getRecipeListData } from "./recipe.service";
import type { RecipeListQuery } from "@/types/recipe.types";

// ── Query Keys ───────────────────────────────────────────────

export const recipeKeys = {
  all: ["recipes"] as const,
  list: (query: RecipeListQuery) => ["recipes", "list", query] as const,
  detail: (recipeUuid: string) => ["recipes", "detail", recipeUuid] as const,
};

// ── List Query Options ───────────────────────────────────────

export const getRecipeListQueryOptions = (query: RecipeListQuery = {}) => ({
  queryKey: recipeKeys.list(query),
  queryFn: () => getRecipeListData(query),
  placeholderData: keepPreviousData,
});

// ── Detail Query Options ─────────────────────────────────────

export const getRecipeDetailQueryOptions = (recipeUuid: string) => ({
  queryKey: recipeKeys.detail(recipeUuid),
  queryFn: () => getRecipeDetailData(recipeUuid),
  enabled: typeof recipeUuid === "string" && recipeUuid.length > 0,
  staleTime: 30_000,
});

// ── Hooks (convenience) ──────────────────────────────────────

export function useRecipeListQuery(
  query: RecipeListQuery = {},
  { enabled = true }: { enabled?: boolean } = {},
) {
  return useQuery({
    ...getRecipeListQueryOptions(query),
    enabled,
  });
}

export function useRecipeDetailQuery(recipeUuid: string) {
  return useQuery(getRecipeDetailQueryOptions(recipeUuid));
}

export function useRecipeListInfiniteQuery(query: Omit<RecipeListQuery, "page"> = {}) {
  return useInfiniteQuery({
    queryKey: [...recipeKeys.all, "infinite", query],
    queryFn: ({ pageParam }) => getRecipeListData({ ...query, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.meta.page + 1;
      return nextPage <= lastPage.meta.pageCount ? nextPage : undefined;
    },
  });
}
