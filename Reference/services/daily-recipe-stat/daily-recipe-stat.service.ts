import { apiClient, buildListParams } from "@/services/api";
import type {
    DailyRecipeStatItem,
    DailyRecipeStatListQuery,
    DailyRecipeStatListResult,
} from "@/types/daily-recipe-stat.types";

// ── List ─────────────────────────────────────────────────────

export async function getDailyRecipeStatListData(
  query: DailyRecipeStatListQuery = {},
): Promise<DailyRecipeStatListResult> {
  return apiClient.get<DailyRecipeStatListResult>("/api/DailyRecipeStat", {
    params: buildListParams(query),
  });
}

// ── Detail ───────────────────────────────────────────────────

export async function getDailyRecipeStatDetailData(
  uuid: string,
): Promise<DailyRecipeStatItem> {
  return apiClient.get<DailyRecipeStatItem>(`/api/DailyRecipeStat/${uuid}`);
}

// ── Today ────────────────────────────────────────────────────

export async function getDailyRecipeStatTodayData(): Promise<DailyRecipeStatItem> {
  return apiClient.get<DailyRecipeStatItem>("/api/DailyRecipeStat/today");
}

// ── Last (most recent) ──────────────────────────────────────

export async function getDailyRecipeStatLastData(): Promise<DailyRecipeStatItem> {
  return apiClient.get<DailyRecipeStatItem>("/api/DailyRecipeStat/last");
}
