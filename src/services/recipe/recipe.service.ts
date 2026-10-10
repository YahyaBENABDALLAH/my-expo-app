import { recipeItemSchema, recipeListSchema } from '@/validation/schemas/api/recipe';
import { apiClient } from '../api';
import { entityPath, normalizeListQuery, type ApiReadOptions } from '../request-utils';
import type {
  RecipeItem,
  RecipeListQuery,
  RecipeListResult,
  CreateRecipeBody,
} from '@/types/recipe.types';

const endpoint = '/api/Recipe';

/** HTTP DTOs and documented endpoints only. No React, navigation or cache effects. */
export const recipeService = {
  list: (query: RecipeListQuery = {}, options: ApiReadOptions = {}) =>
    apiClient.get<RecipeListResult>(endpoint, {
      ...options,
      params: normalizeListQuery(query, {}),
      responseSchema: recipeListSchema,
    }),
  detail: (uuid: string, options: ApiReadOptions = {}) =>
    apiClient.get<RecipeItem>(entityPath(endpoint, uuid), {
      ...options,
      responseSchema: recipeItemSchema,
    }),

  create: (chefUuid: string, body: CreateRecipeBody) =>
    apiClient.post<RecipeItem, CreateRecipeBody>(entityPath(endpoint, chefUuid), body, {
      responseSchema: recipeItemSchema,
    }),
};
