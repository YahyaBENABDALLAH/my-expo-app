import { apiClient, buildListParams } from "@/services/api";
import type {
    RecipeIngredientItem,
    RecipeIngredientListQuery,
    RecipeIngredientListResult,
} from "@/types/recipe-ingredient.types";

// ── List ─────────────────────────────────────────────────────

export async function getRecipeIngredientListData(
  query: RecipeIngredientListQuery = {},
): Promise<RecipeIngredientListResult> {
  return apiClient.get<RecipeIngredientListResult>("/api/RecipeIngredient", {
    params: buildListParams(query),
  });
}

// ── Detail (composite key) ──────────────────────────────────

export async function getRecipeIngredientDetailData(
  recipeUuid: string,
  ingredientUuid: string,
): Promise<RecipeIngredientItem> {
  return apiClient.get<RecipeIngredientItem>(
    `/api/RecipeIngredient/${recipeUuid}/${ingredientUuid}`,
  );
}
