import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
    getRecipeStepDetailData,
    getRecipeStepListData,
} from "./recipe-step.service";
import type { RecipeStepListQuery } from "@/types/recipe-step.types";

// ── Query Keys ───────────────────────────────────────────────

export const recipeStepKeys = {
  all: ["recipe-steps"] as const,
  list: (query: RecipeStepListQuery) =>
    ["recipe-steps", "list", query] as const,
  detail: (uuid: string) => ["recipe-steps", "detail", uuid] as const,
};

// ── List Query Options ───────────────────────────────────────

export const getRecipeStepListQueryOptions = (
  query: RecipeStepListQuery = {},
) => ({
  queryKey: recipeStepKeys.list(query),
  queryFn: () => getRecipeStepListData(query),
  placeholderData: keepPreviousData,
});

// ── Detail Query Options ─────────────────────────────────────

export const getRecipeStepDetailQueryOptions = (uuid: string) => ({
  queryKey: recipeStepKeys.detail(uuid),
  queryFn: () => getRecipeStepDetailData(uuid),
  staleTime: 30_000,
});

// ── Hooks ────────────────────────────────────────────────────

export function useRecipeStepListQuery(query: RecipeStepListQuery = {}) {
  return useQuery(getRecipeStepListQueryOptions(query));
}

export function useRecipeStepDetailQuery(uuid: string) {
  return useQuery(getRecipeStepDetailQueryOptions(uuid));
}
