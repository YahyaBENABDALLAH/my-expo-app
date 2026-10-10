import type { z } from 'zod';
import type { cuisineItemSchema } from '@/validation/schemas/api/cuisine';
import type { PaginatedResponse } from '@/types/pagination.types';

// ── Item ─────────────────────────────────────────────────────

export type CuisineItem = z.infer<typeof cuisineItemSchema>;

// ── Query ────────────────────────────────────────────────────

export type CuisineListQuery = {
  page?: number;
  pageSize?: number;
  isActive?: boolean;
  search?: string;
};

// ── Response ─────────────────────────────────────────────────

export type CuisineListResult = PaginatedResponse<CuisineItem>;
