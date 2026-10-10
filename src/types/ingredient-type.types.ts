import type { z } from 'zod';
import type { ingredientTypeItemSchema } from '@/validation/schemas/api/ingredient-type';
import type { PaginatedResponse } from '@/types/pagination.types';

// ── Item ─────────────────────────────────────────────────────

export type IngredientTypeItem = z.infer<typeof ingredientTypeItemSchema>;

// ── Query ────────────────────────────────────────────────────

export type IngredientTypeListQuery = {
  page?: number;
  pageSize?: number;
  isActive?: boolean;
  search?: string;
};

// ── Response ─────────────────────────────────────────────────

export type IngredientTypeListResult = PaginatedResponse<IngredientTypeItem>;
