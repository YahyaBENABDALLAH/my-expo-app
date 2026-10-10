import {
  recipeShareItemSchema,
  recipeShareListSchema,
} from '@/validation/schemas/api/recipe-share';
import { apiClient } from '../api';
import { entityPath, normalizeListQuery, type ApiReadOptions } from '../request-utils';
import type {
  RecipeShareItem,
  RecipeShareListQuery,
  RecipeShareListResult,
} from '@/types/recipe-share.types';

const endpoint = '/api/RecipeShare';

/** HTTP DTOs and documented endpoints only. No React, navigation or cache effects. */
export const recipeShareService = {
  list: (query: RecipeShareListQuery = {}, options: ApiReadOptions = {}) =>
    apiClient.get<RecipeShareListResult>(endpoint, {
      ...options,
      params: normalizeListQuery(query, {}),
      responseSchema: recipeShareListSchema,
    }),
  detail: (uuid: string, options: ApiReadOptions = {}) =>
    apiClient.get<RecipeShareItem>(entityPath(endpoint, uuid), {
      ...options,
      responseSchema: recipeShareItemSchema,
    }),
};
