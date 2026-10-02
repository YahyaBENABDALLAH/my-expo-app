import type { PaginatedResponse } from "@/types/pagination.types";

// ── Item ─────────────────────────────────────────────────────

export type IngredientTypeItem = {
  uuid: string;
  code: string | null;
  label: string;
  isActive: boolean;
  sortOrder: number;
  iconUrl: string | null;
  color: string | null;
  dateInsert: string;
  dateModif: string | null;
};

// ── Query ────────────────────────────────────────────────────

export type IngredientTypeListQuery = {
  page?: number;
  pageSize?: number;
  isActive?: boolean;
  search?: string;
};

// ── Response ─────────────────────────────────────────────────

export type IngredientTypeListResult = PaginatedResponse<IngredientTypeItem>;
