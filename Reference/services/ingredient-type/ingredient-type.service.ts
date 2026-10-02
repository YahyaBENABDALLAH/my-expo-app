import { apiClient, buildListParams } from "@/services/api";
import type {
    IngredientTypeItem,
    IngredientTypeListQuery,
    IngredientTypeListResult,
} from "@/types/ingredient-type.types";

// ── List ─────────────────────────────────────────────────────

export async function getIngredientTypeListData(
  query: IngredientTypeListQuery = {},
): Promise<IngredientTypeListResult> {
  return apiClient.get<IngredientTypeListResult>("/api/IngredientType", {
    params: buildListParams(query),
  });
}

// ── Detail ───────────────────────────────────────────────────

export async function getIngredientTypeDetailData(
  uuid: string,
): Promise<IngredientTypeItem> {
  return apiClient.get<IngredientTypeItem>(`/api/IngredientType/${uuid}`);
}
