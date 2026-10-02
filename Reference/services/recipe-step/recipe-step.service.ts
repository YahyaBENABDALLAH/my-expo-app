import { apiClient, buildListParams } from "@/services/api";
import type {
    RecipeStepItem,
    RecipeStepListQuery,
    RecipeStepListResult,
} from "@/types/recipe-step.types";

// ── List ─────────────────────────────────────────────────────

export async function getRecipeStepListData(
  query: RecipeStepListQuery = {},
): Promise<RecipeStepListResult> {
  return apiClient.get<RecipeStepListResult>("/api/RecipeStep", {
    params: buildListParams(query),
  });
}

// ── Detail ───────────────────────────────────────────────────

export async function getRecipeStepDetailData(
  uuid: string,
): Promise<RecipeStepItem> {
  return apiClient.get<RecipeStepItem>(`/api/RecipeStep/${uuid}`);
}
