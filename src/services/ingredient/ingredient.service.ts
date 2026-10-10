import { ingredientItemSchema, ingredientListSchema } from '@/validation/schemas/api/ingredient';
import { apiClient } from '../api';
import { entityPath, normalizeListQuery, type ApiReadOptions } from '../request-utils';
import type {
  IngredientItem,
  IngredientListQuery,
  IngredientListResult,
} from '@/types/ingredient.types';

const endpoint = '/api/Ingredient';

/** HTTP DTOs and documented endpoints only. No React, navigation or cache effects. */
export const ingredientService = {
  list: (query: IngredientListQuery = {}, options: ApiReadOptions = {}) =>
    apiClient.get<IngredientListResult>(endpoint, {
      ...options,
      params: normalizeListQuery(query, { pageSize: 20 }),
      responseSchema: ingredientListSchema,
    }),
  detail: (uuid: string, options: ApiReadOptions = {}) =>
    apiClient.get<IngredientItem>(entityPath(endpoint, uuid), {
      ...options,
      responseSchema: ingredientItemSchema,
    }),
};
