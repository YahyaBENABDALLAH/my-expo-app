import { z } from 'zod';

export const passwordResetSchema = z
  .object({
    code: z
      .string()
      .trim()
      .regex(/^\d{6}$/, 'auth.recoveryCodeInvalid'),
    newPassword: z.string().min(8, 'auth.passwordMinLength').max(128),
    confirmPassword: z.string(),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    message: 'auth.passwordMismatch',
    path: ['confirmPassword'],
  });

export function isValidPasswordResetChallengeId(value: unknown): value is string {
  return typeof value === 'string' && z.uuid().safeParse(value).success;
}

export type PasswordResetFormValues = z.infer<typeof passwordResetSchema>;
