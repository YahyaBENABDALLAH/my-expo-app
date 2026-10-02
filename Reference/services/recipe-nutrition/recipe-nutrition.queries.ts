import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
    getRecipeNutritionDetailData,
    getRecipeNutritionListData,
} from "./recipe-nutrition.service";
import type { RecipeNutritionListQuery } from "@/types/recipe-nutrition.types";

// ── Query Keys ───────────────────────────────────────────────

export const recipeNutritionKeys = {
  all: ["recipe-nutrition"] as const,
  list: (query: RecipeNutritionListQuery) =>
    ["recipe-nutrition", "list", query] as const,
  detail: (recipeUuid: string) =>
    ["recipe-nutrition", "detail", recipeUuid] as const,
};

// ── List Query Options ───────────────────────────────────────

export const getRecipeNutritionListQueryOptions = (
  query: RecipeNutritionListQuery = {},
) => ({
  queryKey: recipeNutritionKeys.list(query),
  queryFn: () => getRecipeNutritionListData(query),
  placeholderData: keepPreviousData,
});

// ── Detail Query Options ─────────────────────────────────────

export const getRecipeNutritionDetailQueryOptions = (recipeUuid: string) => ({
  queryKey: recipeNutritionKeys.detail(recipeUuid),
  queryFn: () => getRecipeNutritionDetailData(recipeUuid),
  staleTime: 30_000,
});

// ── Hooks ────────────────────────────────────────────────────

export function useRecipeNutritionListQuery(
  query: RecipeNutritionListQuery = {},
) {
  return useQuery(getRecipeNutritionListQueryOptions(query));
}

export function useRecipeNutritionDetailQuery(recipeUuid: string) {
  return useQuery(getRecipeNutritionDetailQueryOptions(recipeUuid));
}
