import {
  foodCategoryItemSchema,
  foodCategoryListSchema,
} from '@/validation/schemas/api/food-category';
import { apiClient } from '../api';
import { entityPath, normalizeListQuery, type ApiReadOptions } from '../request-utils';
import type {
  FoodCategoryItem,
  FoodCategoryListQuery,
  FoodCategoryListResult,
} from '@/types/food-category.types';

const endpoint = '/api/FoodCategory';

/** HTTP DTOs and documented endpoints only. No React, navigation or cache effects. */
export const foodCategoryService = {
  list: (query: FoodCategoryListQuery = {}, options: ApiReadOptions = {}) =>
    apiClient.get<FoodCategoryListResult>(endpoint, {
      ...options,
      params: normalizeListQuery(query, { pageSize: 20 }),
      responseSchema: foodCategoryListSchema,
    }),
  detail: (uuid: string, options: ApiReadOptions = {}) =>
    apiClient.get<FoodCategoryItem>(entityPath(endpoint, uuid), {
      ...options,
      responseSchema: foodCategoryItemSchema,
    }),
};
