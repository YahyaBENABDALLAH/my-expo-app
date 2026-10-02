import type { PaginatedResponse } from "@/types/pagination.types";

// ── Item ─────────────────────────────────────────────────────

export type MoroccanRegionItem = {
  uuid: string;
  code: string | null;
  name: string;
  isActive: boolean;
  sortOrder: number;
  dateInsert: string;
  dateModif: string | null;
};

// ── Query ────────────────────────────────────────────────────

export type MoroccanRegionListQuery = {
  page?: number;
  pageSize?: number;
  isActive?: boolean;
  search?: string;
};

// ── Response ─────────────────────────────────────────────────

export type MoroccanRegionListResult = PaginatedResponse<MoroccanRegionItem>;
