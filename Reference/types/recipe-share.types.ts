import type { PaginatedResponse } from "@/types/pagination.types";

// ── Item ─────────────────────────────────────────────────────

export type RecipeShareItem = {
  uuid: string;
  code: string | null;
  recipeUuid: string;
  recipeTitle: string | null;
  sharedByUserUuid: string;
  sharedByUserName: string | null;
  sharedByUserFullName: string | null;
  sharedWithUserUuid: string | null;
  sharedWithUserName: string | null;
  sharedWithUserFullName: string | null;
  shareChannel: string | null;
  shareMessage: string | null;
  sharedAt: string;
};

// ── Query ────────────────────────────────────────────────────

export type RecipeShareListQuery = {
  page?: number;
  pageSize?: number;
  recipeUuid?: string;
  sharedByUserUuid?: string;
  sharedWithUserUuid?: string;
  channel?: string;
  search?: string;
};

// ── Response ─────────────────────────────────────────────────

export type RecipeShareListResult = PaginatedResponse<RecipeShareItem>;
