import { z } from 'zod';
import { paginatedResponseSchema } from './pagination';

export const recipeIngredientItemSchema = z.looseObject({
  recipeUuid: z.string().min(1),
  code: z.string().nullable(),
  recipeTitle: z.string().nullable(),
  ingredientUuid: z.string().min(1),
  ingredientName: z.string().nullable(),
  unitUuid: z.string().min(1).nullable(),
  unitLabel: z.string().nullable(),
  quantity: z.number(),
  isOptional: z.boolean(),
  notes: z.string().nullable(),
  sortOrder: z.number(),
});

export const recipeIngredientListSchema = paginatedResponseSchema(recipeIngredientItemSchema);
