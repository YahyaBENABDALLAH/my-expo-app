import type { z } from 'zod';
import type { recipeLikeItemSchema } from '@/validation/schemas/api/recipe-like';
import type { PaginatedResponse } from '@/types/pagination.types';

export type RecipeLikeItem = z.infer<typeof recipeLikeItemSchema>;

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
