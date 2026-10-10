import { cuisineItemSchema, cuisineListSchema } from '@/validation/schemas/api/cuisine';
import { apiClient } from '../api';
import { entityPath, normalizeListQuery, type ApiReadOptions } from '../request-utils';
import type { CuisineItem, CuisineListQuery, CuisineListResult } from '@/types/cuisine.types';

const endpoint = '/api/Cuisine';

/** HTTP DTOs and documented endpoints only. No React, navigation or cache effects. */
export const cuisineService = {
  list: (query: CuisineListQuery = {}, options: ApiReadOptions = {}) =>
    apiClient.get<CuisineListResult>(endpoint, {
      ...options,
      params: normalizeListQuery(query, { pageSize: 20 }),
      responseSchema: cuisineListSchema,
    }),
  detail: (uuid: string, options: ApiReadOptions = {}) =>
    apiClient.get<CuisineItem>(entityPath(endpoint, uuid), {
      ...options,
      responseSchema: cuisineItemSchema,
    }),
};
