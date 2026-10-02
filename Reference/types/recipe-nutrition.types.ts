import type { PaginatedResponse } from "@/types/pagination.types";

// ── Item ─────────────────────────────────────────────────────

export type RecipeNutritionItem = {
  recipeUuid: string;
  code: string | null;
  recipeTitle: string | null;
  caloriesPerServing: number;
  proteinGrams: number | null;
  carbsGrams: number | null;
  fatGrams: number | null;
};

// ── Query ────────────────────────────────────────────────────

export type RecipeNutritionListQuery = {
  page?: number;
  pageSize?: number;
  recipeUuid?: string;
  search?: string;
};

// ── Response ─────────────────────────────────────────────────

export type RecipeNutritionListResult = PaginatedResponse<RecipeNutritionItem>;
