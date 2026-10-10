import type { z } from 'zod';
import type { dailyRecipeStatItemSchema } from '@/validation/schemas/api/daily-recipe-stat';
import type { PaginatedResponse } from '@/types/pagination.types';

// ── Item ─────────────────────────────────────────────────────

export type DailyRecipeStatItem = z.infer<typeof dailyRecipeStatItemSchema>;

// ── Query ────────────────────────────────────────────────────

export type DailyRecipeStatListQuery = {
  page?: number;
  pageSize?: number;
};

// ── Response ─────────────────────────────────────────────────

export type DailyRecipeStatListResult = PaginatedResponse<DailyRecipeStatItem>;
