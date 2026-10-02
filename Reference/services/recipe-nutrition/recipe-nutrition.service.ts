import { apiClient, buildListParams } from "@/services/api";
import type {
    RecipeNutritionItem,
    RecipeNutritionListQuery,
    RecipeNutritionListResult,
} from "@/types/recipe-nutrition.types";

// ── List ─────────────────────────────────────────────────────

export async function getRecipeNutritionListData(
  query: RecipeNutritionListQuery = {},
): Promise<RecipeNutritionListResult> {
  return apiClient.get<RecipeNutritionListResult>("/api/RecipeNutrition", {
    params: buildListParams(query),
  });
}

// ── Detail (by recipeId) ─────────────────────────────────────

export async function getRecipeNutritionDetailData(
  recipeUuid: string,
): Promise<RecipeNutritionItem> {
  return apiClient.get<RecipeNutritionItem>(`/api/RecipeNutrition/${recipeUuid}`);
}
