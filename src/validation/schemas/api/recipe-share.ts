import { z } from 'zod';
import { paginatedResponseSchema } from './pagination';

export const recipeShareItemSchema = z.looseObject({
  uuid: z.string().min(1),
  code: z.string().nullable(),
  recipeUuid: z.string().min(1),
  recipeTitle: z.string().nullable(),
  sharedByUserUuid: z.string().min(1),
  sharedByUserName: z.string().nullable(),
  sharedByUserFullName: z.string().nullable(),
  sharedWithUserUuid: z.string().min(1).nullable(),
  sharedWithUserName: z.string().nullable(),
  sharedWithUserFullName: z.string().nullable(),
  shareChannel: z.string().nullable(),
  shareMessage: z.string().nullable(),
  sharedAt: z.string(),
});

export const recipeShareListSchema = paginatedResponseSchema(recipeShareItemSchema);
