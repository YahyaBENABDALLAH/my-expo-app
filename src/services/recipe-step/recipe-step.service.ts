import { recipeStepItemSchema, recipeStepListSchema } from '@/validation/schemas/api/recipe-step';
import { apiClient } from '../api';
import { entityPath, normalizeListQuery, type ApiReadOptions } from '../request-utils';
import type {
  RecipeStepItem,
  RecipeStepListQuery,
  RecipeStepListResult,
} from '@/types/recipe-step.types';

const endpoint = '/api/RecipeStep';

/** HTTP DTOs and documented endpoints only. No React, navigation or cache effects. */
export const recipeStepService = {
  list: (query: RecipeStepListQuery = {}, options: ApiReadOptions = {}) =>
    apiClient.get<RecipeStepListResult>(endpoint, {
      ...options,
      params: normalizeListQuery(query, {}),
      responseSchema: recipeStepListSchema,
    }),
  detail: (uuid: string, options: ApiReadOptions = {}) =>
    apiClient.get<RecipeStepItem>(entityPath(endpoint, uuid), {
      ...options,
      responseSchema: recipeStepItemSchema,
    }),
};
