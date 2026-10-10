import {
  moroccanRegionItemSchema,
  moroccanRegionListSchema,
} from '@/validation/schemas/api/moroccan-region';
import { apiClient } from '../api';
import { entityPath, normalizeListQuery, type ApiReadOptions } from '../request-utils';
import type {
  MoroccanRegionItem,
  MoroccanRegionListQuery,
  MoroccanRegionListResult,
} from '@/types/moroccan-region.types';

const endpoint = '/api/MoroccanRegion';

/** HTTP DTOs and documented endpoints only. No React, navigation or cache effects. */
export const moroccanRegionService = {
  list: (query: MoroccanRegionListQuery = {}, options: ApiReadOptions = {}) =>
    apiClient.get<MoroccanRegionListResult>(endpoint, {
      ...options,
      params: normalizeListQuery(query, { pageSize: 20 }),
      responseSchema: moroccanRegionListSchema,
    }),
  detail: (uuid: string, options: ApiReadOptions = {}) =>
    apiClient.get<MoroccanRegionItem>(entityPath(endpoint, uuid), {
      ...options,
      responseSchema: moroccanRegionItemSchema,
    }),
};
