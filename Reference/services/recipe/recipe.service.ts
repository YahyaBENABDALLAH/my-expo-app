import { apiClient, buildListParams } from "@/services/api";
import type {
    CreateRecipeBody,
    RecipeItem,
    RecipeListQuery,
    RecipeListResult,
} from "@/types/recipe.types";

// ── List ─────────────────────────────────────────────────────

export async function getRecipeListData(
  query: RecipeListQuery = {},
): Promise<RecipeListResult> {
  return apiClient.get<RecipeListResult>("/api/Recipe", {
    params: buildListParams(query, { page: 1, pageSize: 12 }),
  });
}

// ── Detail ───────────────────────────────────────────────────

export async function getRecipeDetailData(
  recipeUuid: string,
): Promise<RecipeItem> {
  return apiClient.get<RecipeItem>(`/api/Recipe/${recipeUuid}`);
}

// ── Create ───────────────────────────────────────────────────

export async function createRecipeData(
  chefUuid: string,
  body: CreateRecipeBody,
): Promise<RecipeItem> {
  return apiClient.post<RecipeItem>(`/api/Recipe/${chefUuid}`, body);
}

