import type { PaginatedResponse } from "@/types/pagination.types";

export interface RecipeLikeItem {
  recipeUuid: string;
  recipeTitle: string | null;
  userUuid: string;
  userName: string | null;
  userFullName: string | null;
  likedAt: string;
}

export interface RecipeLikeListQuery {
  page?: number;
  pageSize?: number;
  recipeUuid?: string;
  userUuid?: string;
  search?: string;
}

export type RecipeLikeListResult = PaginatedResponse<RecipeLikeItem>;

export interface CreateRecipeLikeBody {
  recipeUuid: string;
  userUuid: string;
}
