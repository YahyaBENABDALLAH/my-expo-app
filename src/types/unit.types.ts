import type { z } from 'zod';
import type { unitItemSchema } from '@/validation/schemas/api/unit';
import type { PaginatedResponse } from '@/types/pagination.types';

// ── Item ─────────────────────────────────────────────────────

export type UnitItem = z.infer<typeof unitItemSchema>;

// ── Query ────────────────────────────────────────────────────

export type UnitListQuery = {
  page?: number;
  pageSize?: number;
  isActive?: boolean;
  search?: string;
};

// ── Response ─────────────────────────────────────────────────

export type UnitListResult = PaginatedResponse<UnitItem>;
