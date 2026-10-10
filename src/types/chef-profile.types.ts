import type { z } from 'zod';
import type { chefProfileItemSchema } from '@/validation/schemas/api/chef-profile';
import type { PaginatedResponse } from '@/types/pagination.types';

// ── Item ─────────────────────────────────────────────────────

export type ChefProfileItem = z.infer<typeof chefProfileItemSchema>;

// ── Query ────────────────────────────────────────────────────

export type ChefProfileListQuery = {
  page?: number;
  pageSize?: number;
  isVerified?: boolean;
  search?: string;
};

// ── Payloads ─────────────────────────────────────────────────

export type CreateChefProfilePayload = {
  displayName: string;
  bio?: string | null;
  specialty?: string | null;
  yearsOfExperience?: number | null;
};

export type UpdateChefProfilePayload = {
  displayName?: string | null;
  bio?: string | null;
  specialty?: string | null;
  yearsOfExperience?: number | null;
};

// ── Response ─────────────────────────────────────────────────

export type ChefProfileListResult = PaginatedResponse<ChefProfileItem>;
