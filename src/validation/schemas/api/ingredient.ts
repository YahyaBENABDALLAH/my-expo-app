import { z } from 'zod';
import { paginatedResponseSchema } from './pagination';

export const ingredientItemSchema = z.looseObject({
  uuid: z.string().min(1),
  code: z.string().nullable(),
  name: z.string(),
  ingredientTypeUuid: z.string().min(1),
  ingredientTypeLabel: z.string().nullable(),
  defaultUnitUuid: z.string().min(1).nullable(),
  defaultUnitLabel: z.string().nullable(),
  caloriesPer100g: z.number().nullable(),
  isActive: z.boolean(),
  imageUrl: z.string().nullable().optional(),
});

export const ingredientListSchema = paginatedResponseSchema(ingredientItemSchema);
