import { z } from 'zod';

const email = z
  .string()
  .trim()
  .min(1, 'auth.emailRequired')
  .max(256, 'auth.emailTooLong')
  .toLowerCase()
  .pipe(z.email({ error: 'auth.invalidEmail' }));
const password = z.string().min(8, 'auth.passwordMinLength').max(128, 'auth.passwordMaxLength');
const name = z.string().trim().max(100, 'auth.max100');

export const loginSchema = z.object({
  login: z.string().trim().min(3, 'auth.identityRequired').max(256, 'auth.max256'),
  password,
});
export const registerSchema = z
  .object({
    userName: z.string().trim().min(3, 'auth.min3').max(50, 'auth.max50'),
    firstName: name,
    lastName: name,
    email,
    password,
    confirmPassword: z.string().min(1, 'auth.confirmRequired'),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: 'auth.passwordMismatch',
    path: ['confirmPassword'],
  });
export const forgotPasswordSchema = z.object({ email });
export const verifyEmailSchema = z.object({
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'auth.codeInvalid'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type VerifyEmailFormValues = z.infer<typeof verifyEmailSchema>;
