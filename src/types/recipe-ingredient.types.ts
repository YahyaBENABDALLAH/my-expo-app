import type { z } from 'zod';
import type { recipeIngredientItemSchema } from '@/validation/schemas/api/recipe-ingredient';
import type { PaginatedResponse } from '@/types/pagination.types';

// ── Item ─────────────────────────────────────────────────────

export type RecipeIngredientItem = z.infer<typeof recipeIngredientItemSchema>;

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

export type RecipeIngredientListResult = PaginatedResponse<RecipeIngredientItem>;
