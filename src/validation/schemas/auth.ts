import { z } from 'zod';

const email = z
  .string()
  .trim()
  .min(1, 'Enter your email address.')
  .max(254, 'Email address is too long.')
  .toLowerCase()
  .pipe(z.email({ error: 'Enter a valid email address.' }));

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Enter your password.'),
});

export const registerSchema = z
  .object({
    name: z.string().trim().min(1, 'Enter your name.').max(80, 'Use 80 characters or fewer.'),
    email,
    password: z
      .string()
      .min(8, 'Use at least 8 characters.')
      .max(128, 'Use 128 characters or fewer.'),
    confirmPassword: z.string().min(1, 'Confirm your password.'),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z.object({ email });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
