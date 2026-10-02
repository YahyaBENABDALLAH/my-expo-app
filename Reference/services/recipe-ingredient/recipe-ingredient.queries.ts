import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
    getRecipeIngredientDetailData,
    getRecipeIngredientListData,
} from "./recipe-ingredient.service";
import type { RecipeIngredientListQuery } from "@/types/recipe-ingredient.types";

// ── Query Keys ───────────────────────────────────────────────

export const recipeIngredientKeys = {
  all: ["recipe-ingredients"] as const,
  list: (query: RecipeIngredientListQuery) =>
    ["recipe-ingredients", "list", query] as const,
  detail: (recipeUuid: string, ingredientUuid: string) =>
    ["recipe-ingredients", "detail", recipeUuid, ingredientUuid] as const,
};

// ── List Query Options ───────────────────────────────────────

export const getRecipeIngredientListQueryOptions = (
  query: RecipeIngredientListQuery = {},
) => ({
  queryKey: recipeIngredientKeys.list(query),
  queryFn: () => getRecipeIngredientListData(query),
  placeholderData: keepPreviousData,
});

// ── Detail Query Options ─────────────────────────────────────

export const getRecipeIngredientDetailQueryOptions = (
  recipeUuid: string,
  ingredientUuid: string,
) => ({
  queryKey: recipeIngredientKeys.detail(recipeUuid, ingredientUuid),
  queryFn: () => getRecipeIngredientDetailData(recipeUuid, ingredientUuid),
  staleTime: 30_000,
});

// ── Hooks ────────────────────────────────────────────────────

export function useRecipeIngredientListQuery(
  query: RecipeIngredientListQuery = {},
) {
  return useQuery(getRecipeIngredientListQueryOptions(query));
}

export function useRecipeIngredientDetailQuery(
  recipeUuid: string,
  ingredientUuid: string,
) {
  return useQuery(
    getRecipeIngredientDetailQueryOptions(recipeUuid, ingredientUuid),
  );
}
