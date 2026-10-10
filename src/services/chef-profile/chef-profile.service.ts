import {
  chefProfileItemSchema,
  chefProfileListSchema,
} from '@/validation/schemas/api/chef-profile';
import { apiClient } from '../api';
import { entityPath, normalizeListQuery, type ApiReadOptions } from '../request-utils';
import type {
  ChefProfileItem,
  ChefProfileListQuery,
  ChefProfileListResult,
  CreateChefProfilePayload,
  UpdateChefProfilePayload,
} from '@/types/chef-profile.types';

const endpoint = '/api/ChefProfile';

/** HTTP DTOs and documented endpoints only. No React, navigation or cache effects. */
export const chefProfileService = {
  list: (query: ChefProfileListQuery = {}, options: ApiReadOptions = {}) =>
    apiClient.get<ChefProfileListResult>(endpoint, {
      ...options,
      params: normalizeListQuery(query, {}),
      responseSchema: chefProfileListSchema,
    }),
  detail: (uuid: string, options: ApiReadOptions = {}) =>
    apiClient.get<ChefProfileItem>(entityPath(endpoint, uuid), {
      ...options,
      responseSchema: chefProfileItemSchema,
    }),

  // The documented list has no user filter; scan pages until the matching profile is found.
  forUser: async (
    userUuid: string,
    options: ApiReadOptions = {},
  ): Promise<ChefProfileItem | null> => {
    if (!userUuid.trim()) throw new Error('A user identifier is required.');
    let page = 1;
    while (!options.signal?.aborted) {
      const result = await chefProfileService.list({ page, pageSize: 100 }, options);
      const profile = result.data.find((item) => item.userUuid === userUuid.trim());
      if (profile) return profile;
      if (!result.meta.hasNextPage || result.data.length === 0 || result.meta.page < page)
        return null;
      page = result.meta.page + 1;
    }
    throw new Error('Chef profile lookup was canceled.');
  },

  createSelf: (body: CreateChefProfilePayload) =>
    apiClient.post<ChefProfileItem, CreateChefProfilePayload>(`${endpoint}/me`, body, {
      responseSchema: chefProfileItemSchema,
    }),
  update: (uuid: string, body: UpdateChefProfilePayload) =>
    apiClient.patch<ChefProfileItem, UpdateChefProfilePayload>(entityPath(endpoint, uuid), body, {
      responseSchema: chefProfileItemSchema,
    }),
  toggleVerified: (uuid: string) =>
    apiClient.patch<ChefProfileItem>(`${entityPath(endpoint, uuid)}/toggle-verified`, undefined, {
      responseSchema: chefProfileItemSchema,
    }),
};
