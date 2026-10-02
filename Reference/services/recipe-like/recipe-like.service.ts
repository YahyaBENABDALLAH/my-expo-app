import { apiClient, buildListParams } from "@/services/api";
import type {
  CreateRecipeLikeBody,
  RecipeLikeItem,
  RecipeLikeListQuery,
  RecipeLikeListResult,
} from "@/types/recipe-like.types";

// ── List ─────────────────────────────────────────────────────

export async function getRecipeLikeListData(
  query: RecipeLikeListQuery = {},
): Promise<RecipeLikeListResult> {
  return apiClient.get<RecipeLikeListResult>("/api/RecipeLike", {
    params: buildListParams(query, { page: 1, pageSize: 12 }),
  });
}

// ── Detail ───────────────────────────────────────────────────

export async function getRecipeLikeDetailData(
  recipeUuid: string,
  userUuid: string,
): Promise<RecipeLikeItem> {
  return apiClient.get<RecipeLikeItem>(`/api/RecipeLike/${recipeUuid}/${userUuid}`);
}

// ── Create ───────────────────────────────────────────────────

export async function createRecipeLikeData(
  body: CreateRecipeLikeBody,
): Promise<RecipeLikeItem> {
  return apiClient.post<RecipeLikeItem>("/api/RecipeLike", body);
}

// ── Delete ───────────────────────────────────────────────────

export async function deleteRecipeLikeData(
  recipeUuid: string,
  userUuid: string,
): Promise<void> {
  return apiClient.delete<void>(`/api/RecipeLike/${recipeUuid}/${userUuid}`);
}
