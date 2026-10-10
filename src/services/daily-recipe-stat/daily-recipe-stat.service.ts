import {
  dailyRecipeStatItemSchema,
  dailyRecipeStatListSchema,
} from '@/validation/schemas/api/daily-recipe-stat';
import { apiClient } from '../api';
import { entityPath, normalizeListQuery, type ApiReadOptions } from '../request-utils';
import type {
  DailyRecipeStatItem,
  DailyRecipeStatListQuery,
  DailyRecipeStatListResult,
} from '@/types/daily-recipe-stat.types';

const endpoint = '/api/DailyRecipeStat';

/** HTTP DTOs and documented endpoints only. No React, navigation or cache effects. */
export const dailyRecipeStatService = {
  list: (query: DailyRecipeStatListQuery = {}, options: ApiReadOptions = {}) =>
    apiClient.get<DailyRecipeStatListResult>(endpoint, {
      ...options,
      params: normalizeListQuery(query, {}),
      responseSchema: dailyRecipeStatListSchema,
    }),
  detail: (uuid: string, options: ApiReadOptions = {}) =>
    apiClient.get<DailyRecipeStatItem>(entityPath(endpoint, uuid), {
      ...options,
      responseSchema: dailyRecipeStatItemSchema,
    }),

  today: (options: ApiReadOptions = {}) =>
    apiClient.get<DailyRecipeStatItem>(`${endpoint}/today`, {
      ...options,
      responseSchema: dailyRecipeStatItemSchema,
    }),
  last: (options: ApiReadOptions = {}) =>
    apiClient.get<DailyRecipeStatItem>(`${endpoint}/last`, {
      ...options,
      responseSchema: dailyRecipeStatItemSchema,
    }),
};
