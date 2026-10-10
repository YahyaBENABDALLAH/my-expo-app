import type { z } from 'zod';
import type { authUserSchema, authSessionSchema } from '@/validation/schemas/api/auth';
/** Frontend display model, not a Foodiya.Identity response DTO. */
export type AuthUser = z.infer<typeof authUserSchema>;

/** Existing on-device storage format, independent of the wire contract. */
export type AuthSession = z.infer<typeof authSessionSchema>;
