import type { PaginatedResponse } from "@/types/pagination.types";

// ── Item ─────────────────────────────────────────────────────

export type UnitItem = {
  uuid: string;
  code: string | null;
  label: string | null;
  isActive: boolean;
  sortOrder: number;
  dateInsert: string;
  dateModif: string | null;
};

// ── Query ────────────────────────────────────────────────────

export type UnitListQuery = {
  page?: number;
  pageSize?: number;
  isActive?: boolean;
  search?: string;
};

// ── Response ─────────────────────────────────────────────────

export type UnitListResult = PaginatedResponse<UnitItem>;
