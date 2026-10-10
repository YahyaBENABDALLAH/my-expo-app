import { z } from 'zod';
import { paginatedResponseSchema } from './pagination';

export const unitItemSchema = z.looseObject({
  uuid: z.string().min(1),
  code: z.string().nullable(),
  label: z.string().nullable(),
  isActive: z.boolean(),
  sortOrder: z.number(),
  dateInsert: z.string(),
  dateModif: z.string().nullable(),
});

export const unitListSchema = paginatedResponseSchema(unitItemSchema);
