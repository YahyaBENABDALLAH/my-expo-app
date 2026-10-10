import { z } from 'zod';
import { paginatedResponseSchema } from './pagination';

export const recipeNutritionItemSchema = z.looseObject({
  recipeUuid: z.string().min(1),
  code: z.string().nullable(),
  recipeTitle: z.string().nullable(),
  caloriesPerServing: z.number(),
  proteinGrams: z.number().nullable(),
  carbsGrams: z.number().nullable(),
  fatGrams: z.number().nullable(),
});

export const recipeNutritionListSchema = paginatedResponseSchema(recipeNutritionItemSchema);
