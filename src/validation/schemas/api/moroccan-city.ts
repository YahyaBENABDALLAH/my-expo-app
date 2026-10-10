import { z } from 'zod';
import { paginatedResponseSchema } from './pagination';

export const moroccanCityItemSchema = z.looseObject({
  uuid: z.string().min(1),
  code: z.string().nullable(),
  regionUuid: z.string().min(1),
  regionName: z.string().nullable(),
  name: z.string(),
  slug: z.string().nullable(),
  isActive: z.boolean(),
  sortOrder: z.number(),
  dateInsert: z.string(),
  dateModif: z.string().nullable(),
});

export const moroccanCityListSchema = paginatedResponseSchema(moroccanCityItemSchema);
