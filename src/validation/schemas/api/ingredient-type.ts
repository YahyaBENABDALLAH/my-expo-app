import { z } from 'zod';
import { paginatedResponseSchema } from './pagination';

export const ingredientTypeItemSchema = z.looseObject({
  uuid: z.string().min(1),
  code: z.string().nullable(),
  label: z.string(),
  isActive: z.boolean(),
  sortOrder: z.number(),
  iconUrl: z.string().nullable(),
  color: z.string().nullable(),
  dateInsert: z.string(),
  dateModif: z.string().nullable(),
});

export const ingredientTypeListSchema = paginatedResponseSchema(ingredientTypeItemSchema);
