import {
  moroccanCityItemSchema,
  moroccanCityListSchema,
} from '@/validation/schemas/api/moroccan-city';
import { apiClient } from '../api';
import { entityPath, normalizeListQuery, type ApiReadOptions } from '../request-utils';
import type {
  MoroccanCityItem,
  MoroccanCityListQuery,
  MoroccanCityListResult,
} from '@/types/moroccan-city.types';

const endpoint = '/api/MoroccanCity';

/** HTTP DTOs and documented endpoints only. No React, navigation or cache effects. */
export const moroccanCityService = {
  list: (query: MoroccanCityListQuery = {}, options: ApiReadOptions = {}) =>
    apiClient.get<MoroccanCityListResult>(endpoint, {
      ...options,
      params: normalizeListQuery(query, { pageSize: 20 }),
      responseSchema: moroccanCityListSchema,
    }),
  detail: (uuid: string, options: ApiReadOptions = {}) =>
    apiClient.get<MoroccanCityItem>(entityPath(endpoint, uuid), {
      ...options,
      responseSchema: moroccanCityItemSchema,
    }),
};
