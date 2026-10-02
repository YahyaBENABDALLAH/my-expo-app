import { zodResolver } from '@hookform/resolvers/zod';

import { forgotPasswordSchema, loginSchema, registerSchema } from '@/validation/schemas/auth';

export const loginResolver = zodResolver(loginSchema);
export const registerResolver = zodResolver(registerSchema);
export const forgotPasswordResolver = zodResolver(forgotPasswordSchema);
