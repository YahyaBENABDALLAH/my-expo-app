import { z } from 'zod';

/** Frontend display metadata; backend roles stay in the Identity wire schemas. */
export const authUserSchema = z.object({
  uuid: z.string().trim().min(1),
  userName: z.string().nullable().optional(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  profileImageUrl: z.string().nullable().optional(),
  isActive: z.boolean().optional(),
});

/** Retain the existing storage key/shape, but never authenticate an unidentified user. */
export const authSessionSchema = z.object({
  accessToken: z.string().trim().min(1),
  // Nullable refresh/expiry metadata remains supported for older canonical records.
  refreshToken: z.string().trim().min(1).nullable(),
  expiresAtUtc: z.iso.datetime({ offset: true }).nullable(),
  user: authUserSchema,
});
