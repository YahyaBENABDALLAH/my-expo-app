import { z } from 'zod';
import { paginatedResponseSchema } from './pagination';

export const chefProfileItemSchema = z.looseObject({
  uuid: z.string().min(1),
  userUuid: z.string().min(1),
  displayName: z.string(),
  bio: z.string().nullable(),
  specialty: z.string().nullable(),
  yearsOfExperience: z.number().nullable(),
  isVerified: z.boolean(),
  dateInsert: z.string(),
  userName: z.string().nullable(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  fullName: z.string().nullable(),
  email: z.string().nullable(),
  color: z.string().nullable(),
  profileImageUrl: z.string().nullable(),
  code: z.string().nullable(),
  codeAlpha: z.string().nullable(),
});

export const chefProfileListSchema = paginatedResponseSchema(chefProfileItemSchema);
