import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
    getRecipeShareDetailData,
    getRecipeShareListData,
} from "./recipe-share.service";
import type { RecipeShareListQuery } from "@/types/recipe-share.types";

// ── Query Keys ───────────────────────────────────────────────

export const recipeShareKeys = {
  all: ["recipe-shares"] as const,
  list: (query: RecipeShareListQuery) =>
    ["recipe-shares", "list", query] as const,
  detail: (uuid: string) => ["recipe-shares", "detail", uuid] as const,
};

// ── List Query Options ───────────────────────────────────────

export const getRecipeShareListQueryOptions = (
  query: RecipeShareListQuery = {},
) => ({
  queryKey: recipeShareKeys.list(query),
  queryFn: () => getRecipeShareListData(query),
  placeholderData: keepPreviousData,
});

// ── Detail Query Options ─────────────────────────────────────

export const getRecipeShareDetailQueryOptions = (uuid: string) => ({
  queryKey: recipeShareKeys.detail(uuid),
  queryFn: () => getRecipeShareDetailData(uuid),
  staleTime: 30_000,
});

// ── Hooks ────────────────────────────────────────────────────

export function useRecipeShareListQuery(query: RecipeShareListQuery = {}) {
  return useQuery(getRecipeShareListQueryOptions(query));
}

export function useRecipeShareDetailQuery(uuid: string) {
  return useQuery(getRecipeShareDetailQueryOptions(uuid));
}
