import { apiClient, buildListParams } from "@/services/api";
import type {
    RecipeShareItem,
    RecipeShareListQuery,
    RecipeShareListResult,
} from "@/types/recipe-share.types";

// ── List ─────────────────────────────────────────────────────

export async function getRecipeShareListData(
  query: RecipeShareListQuery = {},
): Promise<RecipeShareListResult> {
  return apiClient.get<RecipeShareListResult>("/api/RecipeShare", {
    params: buildListParams(query),
  });
}

// ── Detail ───────────────────────────────────────────────────

export async function getRecipeShareDetailData(
  uuid: string,
): Promise<RecipeShareItem> {
  return apiClient.get<RecipeShareItem>(`/api/RecipeShare/${uuid}`);
}
