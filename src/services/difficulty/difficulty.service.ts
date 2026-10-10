import { difficultyItemSchema, difficultyListSchema } from '@/validation/schemas/api/difficulty';
import { apiClient } from '../api';
import { entityPath, normalizeListQuery, type ApiReadOptions } from '../request-utils';
import type {
  DifficultyItem,
  DifficultyListQuery,
  DifficultyListResult,
} from '@/types/difficulty.types';

const endpoint = '/api/Difficulty';

/** HTTP DTOs and documented endpoints only. No React, navigation or cache effects. */
export const difficultyService = {
  list: (query: DifficultyListQuery = {}, options: ApiReadOptions = {}) =>
    apiClient.get<DifficultyListResult>(endpoint, {
      ...options,
      params: normalizeListQuery(query, { pageSize: 20 }),
      responseSchema: difficultyListSchema,
    }),
  detail: (uuid: string, options: ApiReadOptions = {}) =>
    apiClient.get<DifficultyItem>(entityPath(endpoint, uuid), {
      ...options,
      responseSchema: difficultyItemSchema,
    }),
};
