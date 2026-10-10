import type { z } from 'zod';
import type { moroccanRegionItemSchema } from '@/validation/schemas/api/moroccan-region';
import type { PaginatedResponse } from '@/types/pagination.types';

// ── Item ─────────────────────────────────────────────────────

export type MoroccanRegionItem = z.infer<typeof moroccanRegionItemSchema>;

// ── Query ────────────────────────────────────────────────────

export type MoroccanRegionListQuery = {
  page?: number;
  pageSize?: number;
  isActive?: boolean;
  search?: string;
};

// ── Response ─────────────────────────────────────────────────

export type MoroccanRegionListResult = PaginatedResponse<MoroccanRegionItem>;
