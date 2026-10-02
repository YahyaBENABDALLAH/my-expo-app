import type { PaginatedResponse } from "@/types/pagination.types";

// ── Item ─────────────────────────────────────────────────────

export type FoodCategoryItem = {
  uuid: string;
  name: string;
  description: string | null;
  code: string;
  isActive: boolean;
  sortOrder: number;
  iconUrl: string | null;
  color: string | null;
  dateInsert: string;
  dateModif: string | null;
};

// ── Query ────────────────────────────────────────────────────

export type FoodCategoryListQuery = {
  page?: number;
  pageSize?: number;
  isActive?: boolean;
  search?: string;
};

// ── Response ─────────────────────────────────────────────────

export type FoodCategoryListResult = PaginatedResponse<FoodCategoryItem>;
