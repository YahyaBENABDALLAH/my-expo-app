import type { PaginatedResponse } from "@/types/pagination.types";

// ── Item ─────────────────────────────────────────────────────

export type MoroccanCityItem = {
  uuid: string;
  code: string | null;
  regionUuid: string;
  regionName: string | null;
  name: string;
  slug: string | null;
  isActive: boolean;
  sortOrder: number;
  dateInsert: string;
  dateModif: string | null;
};

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
