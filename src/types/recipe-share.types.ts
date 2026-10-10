import type { z } from 'zod';
import type { recipeShareItemSchema } from '@/validation/schemas/api/recipe-share';
import type { PaginatedResponse } from '@/types/pagination.types';

// ── Item ─────────────────────────────────────────────────────

export type RecipeShareItem = z.infer<typeof recipeShareItemSchema>;

// ── Query ────────────────────────────────────────────────────

export type RecipeShareListQuery = {
  page?: number;
  pageSize?: number;
  recipeUuid?: string;
  sharedByUserUuid?: string;
  sharedWithUserUuid?: string;
  channel?: string;
  search?: string;
};

// ── Response ─────────────────────────────────────────────────

export type RecipeShareListResult = PaginatedResponse<RecipeShareItem>;
