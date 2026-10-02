import { apiClient, buildListParams } from "@/services/api";
import type {
    FoodCategoryItem,
    FoodCategoryListQuery,
    FoodCategoryListResult,
} from "@/types/food-category.types";

// ── List ─────────────────────────────────────────────────────

export async function getFoodCategoryListData(
  query: FoodCategoryListQuery = {},
): Promise<FoodCategoryListResult> {
  return apiClient.get<FoodCategoryListResult>("/api/FoodCategory", {
    params: buildListParams(query),
  });
}

// ── Detail ───────────────────────────────────────────────────

export async function getFoodCategoryDetailData(
  uuid: string,
): Promise<FoodCategoryItem> {
  return apiClient.get<FoodCategoryItem>(`/api/FoodCategory/${uuid}`);
}
