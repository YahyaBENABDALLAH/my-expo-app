import { z } from 'zod';
import { paginatedResponseSchema } from './pagination';

export const recipeLikeItemSchema = z.looseObject({
  recipeUuid: z.string().min(1),
  recipeTitle: z.string().nullable(),
  userUuid: z.string().min(1),
  userName: z.string().nullable(),
  userFullName: z.string().nullable(),
  likedAt: z.string(),
});

export const recipeLikeListSchema = paginatedResponseSchema(recipeLikeItemSchema);
