import { unitItemSchema, unitListSchema } from '@/validation/schemas/api/unit';
import { apiClient } from '../api';
import { entityPath, normalizeListQuery, type ApiReadOptions } from '../request-utils';
import type { UnitItem, UnitListQuery, UnitListResult } from '@/types/unit.types';

const endpoint = '/api/Unit';

/** HTTP DTOs and documented endpoints only. No React, navigation or cache effects. */
export const unitService = {
  list: (query: UnitListQuery = {}, options: ApiReadOptions = {}) =>
    apiClient.get<UnitListResult>(endpoint, {
      ...options,
      params: normalizeListQuery(query, { pageSize: 20 }),
      responseSchema: unitListSchema,
    }),
  detail: (uuid: string, options: ApiReadOptions = {}) =>
    apiClient.get<UnitItem>(entityPath(endpoint, uuid), {
      ...options,
      responseSchema: unitItemSchema,
    }),
};
