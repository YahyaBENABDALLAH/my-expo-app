import { z } from 'zod';
import { paginatedResponseSchema } from './pagination';

export const foodCategoryItemSchema = z.looseObject({
  uuid: z.string().min(1),
  name: z.string(),
  description: z.string().nullable(),
  code: z.string(),
  isActive: z.boolean(),
  sortOrder: z.number(),
  iconUrl: z.string().nullable(),
  color: z.string().nullable(),
  dateInsert: z.string(),
  dateModif: z.string().nullable(),
});

export const foodCategoryListSchema = paginatedResponseSchema(foodCategoryItemSchema);
