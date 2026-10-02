import type { PaginatedResponse } from "@/types/pagination.types";

// ── Item ─────────────────────────────────────────────────────

export type RecipeStepItem = {
  uuid: string;
  code: string | null;
  recipeUuid: string;
  recipeTitle: string | null;
  stepNumber: number;
  title: string | null;
  instruction: string | null;
  durationMinutes: number | null;
};

// ── Query ────────────────────────────────────────────────────

export type RecipeStepListQuery = {
  page?: number;
  pageSize?: number;
  recipeUuid?: string;
  search?: string;
};

// ── Response ─────────────────────────────────────────────────

export type RecipeStepListResult = PaginatedResponse<RecipeStepItem>;
