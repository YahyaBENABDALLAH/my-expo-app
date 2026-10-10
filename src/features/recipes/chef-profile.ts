import { z } from 'zod';

export const chefProfileSchema = z.object({
  displayName: z.string().trim().min(1).max(100),
  bio: z.string().trim().max(1000),
  specialty: z.string().trim().max(150),
});
export type ChefProfileDraft = z.infer<typeof chefProfileSchema>;
