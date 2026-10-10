import {
  recipeNutritionItemSchema,
  recipeNutritionListSchema,
} from '@/validation/schemas/api/recipe-nutrition';
import { apiClient } from '../api';
import { entityPath, normalizeListQuery, type ApiReadOptions } from '../request-utils';
import type {
  RecipeNutritionItem,
  RecipeNutritionListQuery,
  RecipeNutritionListResult,
} from '@/types/recipe-nutrition.types';

const endpoint = '/api/RecipeNutrition';

/** HTTP DTOs and documented endpoints only. No React, navigation or cache effects. */
export const recipeNutritionService = {
  list: (query: RecipeNutritionListQuery = {}, options: ApiReadOptions = {}) =>
    apiClient.get<RecipeNutritionListResult>(endpoint, {
      ...options,
      params: normalizeListQuery(query, {}),
      responseSchema: recipeNutritionListSchema,
    }),
  detail: (recipeUuid: string, options: ApiReadOptions = {}) =>
    apiClient.get<RecipeNutritionItem>(entityPath(endpoint, recipeUuid), {
      ...options,
      responseSchema: recipeNutritionItemSchema,
    }),
};
