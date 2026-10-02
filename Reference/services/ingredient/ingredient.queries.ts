import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
    getIngredientDetailData,
    getIngredientListData,
} from "./ingredient.service";
import type { IngredientListQuery } from "@/types/ingredient.types";

// ── Query Keys ───────────────────────────────────────────────

export const ingredientKeys = {
  all: ["ingredients"] as const,
  list: (query: IngredientListQuery) => ["ingredients", "list", query] as const,
  detail: (uuid: string) => ["ingredients", "detail", uuid] as const,
};

// ── List Query Options ───────────────────────────────────────

export const getIngredientListQueryOptions = (
  query: IngredientListQuery = {},
) => ({
  queryKey: ingredientKeys.list(query),
  queryFn: () => getIngredientListData(query),
  placeholderData: keepPreviousData,
});

// ── Detail Query Options ─────────────────────────────────────

export const getIngredientDetailQueryOptions = (uuid: string) => ({
  queryKey: ingredientKeys.detail(uuid),
  queryFn: () => getIngredientDetailData(uuid),
  staleTime: 30_000,
});

// ── Hooks ────────────────────────────────────────────────────

export function useIngredientListQuery(
  query: IngredientListQuery = {},
  { enabled = true }: { enabled?: boolean } = {},
) {
  return useQuery({
    ...getIngredientListQueryOptions(query),
    enabled,
  });
}

export function useIngredientDetailQuery(uuid: string) {
  return useQuery(getIngredientDetailQueryOptions(uuid));
}
