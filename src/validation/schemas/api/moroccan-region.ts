import { z } from 'zod';
import { paginatedResponseSchema } from './pagination';

export const moroccanRegionItemSchema = z.looseObject({
  uuid: z.string().min(1),
  code: z.string().nullable(),
  name: z.string(),
  isActive: z.boolean(),
  sortOrder: z.number(),
  dateInsert: z.string(),
  dateModif: z.string().nullable(),
});

export const moroccanRegionListSchema = paginatedResponseSchema(moroccanRegionItemSchema);
