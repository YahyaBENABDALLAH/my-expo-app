import type { PaginatedResponse } from "@/types/pagination.types";

// ── Item ─────────────────────────────────────────────────────

export type RecipeIngredientItem = {
  recipeUuid: string;
  code: string | null;
  recipeTitle: string | null;
  ingredientUuid: string;
  ingredientName: string | null;
  unitUuid: string | null;
  unitLabel: string | null;
  quantity: number;
  isOptional: boolean;
  notes: string | null;
  sortOrder: number;
};

// ── Query ────────────────────────────────────────────────────

export type RecipeIngredientListQuery = {
  page?: number;
  pageSize?: number;
  recipeUuid?: string;
  ingredientUuid?: string;
  unitUuid?: string;
  search?: string;
};

// ── Response ─────────────────────────────────────────────────

export type RecipeIngredientListResult =
  PaginatedResponse<RecipeIngredientItem>;
