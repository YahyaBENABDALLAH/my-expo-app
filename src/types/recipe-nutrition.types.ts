import type { z } from 'zod';
import type { recipeNutritionItemSchema } from '@/validation/schemas/api/recipe-nutrition';
import type { PaginatedResponse } from '@/types/pagination.types';

// ── Item ─────────────────────────────────────────────────────

export type RecipeNutritionItem = z.infer<typeof recipeNutritionItemSchema>;

// ── Query ────────────────────────────────────────────────────

export type RecipeNutritionListQuery = {
  page?: number;
  pageSize?: number;
  recipeUuid?: string;
  search?: string;
};

// ── Response ─────────────────────────────────────────────────

export type RecipeNutritionListResult = PaginatedResponse<RecipeNutritionItem>;
