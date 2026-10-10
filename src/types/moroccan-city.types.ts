import type { z } from 'zod';
import type { moroccanCityItemSchema } from '@/validation/schemas/api/moroccan-city';
import type { PaginatedResponse } from '@/types/pagination.types';

// ── Item ─────────────────────────────────────────────────────

export type MoroccanCityItem = z.infer<typeof moroccanCityItemSchema>;

// ── Query ────────────────────────────────────────────────────

export type MoroccanCityListQuery = {
  page?: number;
  pageSize?: number;
  regionUuid?: string;
  isActive?: boolean;
  search?: string;
};

// ── Response ─────────────────────────────────────────────────

export type MoroccanCityListResult = PaginatedResponse<MoroccanCityItem>;
