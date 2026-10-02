import { apiClient, buildListParams } from "@/services/api";
import type {
    IngredientItem,
    IngredientListQuery,
    IngredientListResult,
} from "@/types/ingredient.types";

// ── List ─────────────────────────────────────────────────────

export async function getIngredientListData(
  query: IngredientListQuery = {},
): Promise<IngredientListResult> {
  return apiClient.get<IngredientListResult>("/api/Ingredient", {
    params: buildListParams(query),
  });
}

// ── Detail ───────────────────────────────────────────────────

export async function getIngredientDetailData(
  uuid: string,
): Promise<IngredientItem> {
  return apiClient.get<IngredientItem>(`/api/Ingredient/${uuid}`);
}
