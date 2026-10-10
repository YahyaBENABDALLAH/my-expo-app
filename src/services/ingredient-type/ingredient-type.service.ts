import {
  ingredientTypeItemSchema,
  ingredientTypeListSchema,
} from '@/validation/schemas/api/ingredient-type';
import { apiClient } from '../api';
import { entityPath, normalizeListQuery, type ApiReadOptions } from '../request-utils';
import type {
  IngredientTypeItem,
  IngredientTypeListQuery,
  IngredientTypeListResult,
} from '@/types/ingredient-type.types';

const endpoint = '/api/IngredientType';

/** HTTP DTOs and documented endpoints only. No React, navigation or cache effects. */
export const ingredientTypeService = {
  list: (query: IngredientTypeListQuery = {}, options: ApiReadOptions = {}) =>
    apiClient.get<IngredientTypeListResult>(endpoint, {
      ...options,
      params: normalizeListQuery(query, { pageSize: 20 }),
      responseSchema: ingredientTypeListSchema,
    }),
  detail: (uuid: string, options: ApiReadOptions = {}) =>
    apiClient.get<IngredientTypeItem>(entityPath(endpoint, uuid), {
      ...options,
      responseSchema: ingredientTypeItemSchema,
    }),
};
