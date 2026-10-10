import { z } from 'zod';
import { paginatedResponseSchema } from './pagination';

export const dailyRecipeStatItemSchema = z.looseObject({
  uuid: z.string().min(1),
  code: z.string().nullable(),
  statsDate: z.string(),
  generatedAtUtc: z.string(),
  totalRecipes: z.number(),
  totalPublishedRecipes: z.number(),
  newRecipesToday: z.number(),
  totalLikesToday: z.number(),
  topLikedRecipesJson: z.string().nullable(),
  recentRecipesJson: z.string().nullable(),
  cuisineBreakdownJson: z.string().nullable(),
  difficultyBreakdownJson: z.string().nullable(),
});

export const dailyRecipeStatListSchema = paginatedResponseSchema(dailyRecipeStatItemSchema);
