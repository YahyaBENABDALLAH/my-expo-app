import { z } from 'zod';
import { paginatedResponseSchema } from './pagination';

export const recipeStepItemSchema = z.looseObject({
  uuid: z.string().min(1),
  code: z.string().nullable(),
  recipeUuid: z.string().min(1),
  recipeTitle: z.string().nullable(),
  stepNumber: z.number(),
  title: z.string().nullable(),
  instruction: z.string().nullable(),
  durationMinutes: z.number().nullable(),
});

export const recipeStepListSchema = paginatedResponseSchema(recipeStepItemSchema);
