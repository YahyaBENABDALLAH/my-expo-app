import type { PaginatedResponse } from "@/types/pagination.types";

// ── Item ─────────────────────────────────────────────────────

export type DailyRecipeStatItem = {
  uuid: string;
  code: string | null;
  statsDate: string;
  generatedAtUtc: string;
  totalRecipes: number;
  totalPublishedRecipes: number;
  newRecipesToday: number;
  totalLikesToday: number;
  topLikedRecipesJson: string | null;
  recentRecipesJson: string | null;
  cuisineBreakdownJson: string | null;
  difficultyBreakdownJson: string | null;
};

// ── Query ────────────────────────────────────────────────────

export type DailyRecipeStatListQuery = {
  page?: number;
  pageSize?: number;
};

// ── Response ─────────────────────────────────────────────────

export type DailyRecipeStatListResult = PaginatedResponse<DailyRecipeStatItem>;
