import type { z } from 'zod';
import type { difficultyItemSchema } from '@/validation/schemas/api/difficulty';
import type { PaginatedResponse } from '@/types/pagination.types';

// ── Item ─────────────────────────────────────────────────────

export type DifficultyItem = z.infer<typeof difficultyItemSchema>;

// ── Query ────────────────────────────────────────────────────

export type DifficultyListQuery = {
  page?: number;
  pageSize?: number;
  isActive?: boolean;
  search?: string;
};

// ── Response ─────────────────────────────────────────────────

export type DifficultyListResult = PaginatedResponse<DifficultyItem>;
