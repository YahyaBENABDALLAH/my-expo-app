import type { z } from 'zod';
import type { foodCategoryItemSchema } from '@/validation/schemas/api/food-category';
import type { PaginatedResponse } from '@/types/pagination.types';

// ── Item ─────────────────────────────────────────────────────

export type FoodCategoryItem = z.infer<typeof foodCategoryItemSchema>;

// ── Query ────────────────────────────────────────────────────

export type FoodCategoryListQuery = {
  page?: number;
  pageSize?: number;
  isActive?: boolean;
  search?: string;
};

// ── Response ─────────────────────────────────────────────────

export type FoodCategoryListResult = PaginatedResponse<FoodCategoryItem>;
