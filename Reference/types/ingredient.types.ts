import type { PaginatedResponse } from "@/types/pagination.types";

// ── Item ─────────────────────────────────────────────────────

export type IngredientItem = {
  uuid: string;
  code: string | null;
  name: string;
  ingredientTypeUuid: string;
  ingredientTypeLabel: string | null;
  defaultUnitUuid: string | null;
  defaultUnitLabel: string | null;
  caloriesPer100g: number | null;
  isActive: boolean;
  imageUrl?: string | null;
};

// ── Query ────────────────────────────────────────────────────

export type IngredientListQuery = {
  page?: number;
  pageSize?: number;
  ingredientTypeUuid?: string;
  isActive?: boolean;
  search?: string;
};

// ── Response ─────────────────────────────────────────────────

export type IngredientListResult = PaginatedResponse<IngredientItem>;
