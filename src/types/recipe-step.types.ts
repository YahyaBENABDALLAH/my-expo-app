import type { z } from 'zod';
import type { recipeStepItemSchema } from '@/validation/schemas/api/recipe-step';
import type { PaginatedResponse } from '@/types/pagination.types';

// ── Item ─────────────────────────────────────────────────────

export type RecipeStepItem = z.infer<typeof recipeStepItemSchema>;

// ── Query ────────────────────────────────────────────────────

export type RecipeStepListQuery = {
  page?: number;
  pageSize?: number;
  recipeUuid?: string;
  search?: string;
};

// ── Response ─────────────────────────────────────────────────

export type RecipeStepListResult = PaginatedResponse<RecipeStepItem>;
