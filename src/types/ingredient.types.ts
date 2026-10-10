import type { z } from 'zod';
import type { ingredientItemSchema } from '@/validation/schemas/api/ingredient';
import type { PaginatedResponse } from '@/types/pagination.types';

// ── Item ─────────────────────────────────────────────────────

export type IngredientItem = z.infer<typeof ingredientItemSchema>;

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
