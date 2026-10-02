import { apiClient, buildListParams } from "@/services/api";
import type {
    CuisineItem,
    CuisineListQuery,
    CuisineListResult,
} from "@/types/cuisine.types";

// ── List ─────────────────────────────────────────────────────

export async function getCuisineListData(
  query: CuisineListQuery = {},
): Promise<CuisineListResult> {
  return apiClient.get<CuisineListResult>("/api/Cuisine", {
    params: buildListParams(query),
  });
}

// ── Detail ───────────────────────────────────────────────────

export async function getCuisineDetailData(
  cuisineUuid: string,
): Promise<CuisineItem> {
  return apiClient.get<CuisineItem>(`/api/Cuisine/${cuisineUuid}`);
}
