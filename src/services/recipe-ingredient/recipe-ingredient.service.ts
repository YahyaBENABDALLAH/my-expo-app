import {
  recipeIngredientItemSchema,
  recipeIngredientListSchema,
} from '@/validation/schemas/api/recipe-ingredient';
import { apiClient } from '../api';
import { entityPath, normalizeListQuery, type ApiReadOptions } from '../request-utils';
import type {
  RecipeIngredientItem,
  RecipeIngredientListQuery,
  RecipeIngredientListResult,
} from '@/types/recipe-ingredient.types';

const endpoint = '/api/RecipeIngredient';

/** HTTP DTOs and documented endpoints only. No React, navigation or cache effects. */
export const recipeIngredientService = {
  list: (query: RecipeIngredientListQuery = {}, options: ApiReadOptions = {}) =>
    apiClient.get<RecipeIngredientListResult>(endpoint, {
      ...options,
      params: normalizeListQuery(query, {}),
      responseSchema: recipeIngredientListSchema,
    }),
  detail: (recipeUuid: string, ingredientUuid: string, options: ApiReadOptions = {}) =>
    apiClient.get<RecipeIngredientItem>(entityPath(endpoint, recipeUuid, ingredientUuid), {
      ...options,
      responseSchema: recipeIngredientItemSchema,
    }),
};
