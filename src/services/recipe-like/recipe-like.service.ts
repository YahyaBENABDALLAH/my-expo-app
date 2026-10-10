import { recipeLikeItemSchema, recipeLikeListSchema } from '@/validation/schemas/api/recipe-like';
import { apiClient } from '../api';
import { entityPath, normalizeListQuery, type ApiReadOptions } from '../request-utils';
import type {
  RecipeLikeItem,
  RecipeLikeListQuery,
  RecipeLikeListResult,
  CreateRecipeLikeBody,
} from '@/types/recipe-like.types';

const endpoint = '/api/RecipeLike';

/** HTTP DTOs and documented endpoints only. No React, navigation or cache effects. */
export const recipeLikeService = {
  list: (query: RecipeLikeListQuery = {}, options: ApiReadOptions = {}) =>
    apiClient.get<RecipeLikeListResult>(endpoint, {
      ...options,
      params: normalizeListQuery(query, {}),
      responseSchema: recipeLikeListSchema,
    }),
  detail: (recipeUuid: string, userUuid: string, options: ApiReadOptions = {}) =>
    apiClient.get<RecipeLikeItem>(entityPath(endpoint, recipeUuid, userUuid), {
      ...options,
      responseSchema: recipeLikeItemSchema,
    }),

  create: (body: CreateRecipeLikeBody) => {
    entityPath(endpoint, body.recipeUuid, body.userUuid);
    return apiClient.post<RecipeLikeItem, CreateRecipeLikeBody>(
      endpoint,
      {
        recipeUuid: body.recipeUuid.trim(),
        userUuid: body.userUuid.trim(),
      },
      { responseSchema: recipeLikeItemSchema },
    );
  },
  delete: (recipeUuid: string, userUuid: string) =>
    apiClient.delete<void>(entityPath(endpoint, recipeUuid, userUuid)),
};
