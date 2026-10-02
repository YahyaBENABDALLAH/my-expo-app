import type { PaginatedResponse } from "@/types/pagination.types";

// ── Item ─────────────────────────────────────────────────────

export type CuisineItem = {
  uuid: string;
  name: string;
  code: string;
  isActive: boolean;
  sortOrder: number;
  iconUrl: string | null;
  color: string | null;
  dateInsert: string;
  dateModif: string | null;
};

// ── Query ────────────────────────────────────────────────────

export type CuisineListQuery = {
  page?: number;
  pageSize?: number;
  isActive?: boolean;
  search?: string;
};

// ── Response ─────────────────────────────────────────────────

export type CuisineListResult = PaginatedResponse<CuisineItem>;
