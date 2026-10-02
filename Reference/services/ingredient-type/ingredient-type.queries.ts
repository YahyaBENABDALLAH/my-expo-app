import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
    getIngredientTypeDetailData,
    getIngredientTypeListData,
} from "./ingredient-type.service";
import type { IngredientTypeListQuery } from "@/types/ingredient-type.types";

// ── Query Keys ───────────────────────────────────────────────

export const ingredientTypeKeys = {
  all: ["ingredient-types"] as const,
  list: (query: IngredientTypeListQuery) =>
    ["ingredient-types", "list", query] as const,
  detail: (uuid: string) => ["ingredient-types", "detail", uuid] as const,
};

// ── List Query Options ───────────────────────────────────────

export const getIngredientTypeListQueryOptions = (
  query: IngredientTypeListQuery = {},
) => ({
  queryKey: ingredientTypeKeys.list(query),
  queryFn: () => getIngredientTypeListData(query),
  placeholderData: keepPreviousData,
});

// ── Detail Query Options ─────────────────────────────────────

export const getIngredientTypeDetailQueryOptions = (uuid: string) => ({
  queryKey: ingredientTypeKeys.detail(uuid),
  queryFn: () => getIngredientTypeDetailData(uuid),
  staleTime: 30_000,
});

// ── Hooks ────────────────────────────────────────────────────

export function useIngredientTypeListQuery(
  query: IngredientTypeListQuery = {},
) {
  return useQuery(getIngredientTypeListQueryOptions(query));
}

export function useIngredientTypeDetailQuery(uuid: string) {
  return useQuery(getIngredientTypeDetailQueryOptions(uuid));
}
