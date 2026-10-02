import { z } from "zod";

// ── Schema ───────────────────────────────────────────────────

export const createRecipeSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be 200 characters or less"),
  summary: z
    .string()
    .max(1000, "Summary must be 1000 characters or less"),
  difficultyUuid: z
    .string()
    .min(1, "Please select a difficulty level"),
  cuisineUuid: z.string(),
  prepTimeMinutes: z
    .string()
    .refine(
      (v) => !v || (!isNaN(Number(v)) && Number(v) >= 0 && Number(v) <= 1440),
      "Must be 0–1440",
    ),
  cookTimeMinutes: z
    .string()
    .refine(
      (v) => !v || (!isNaN(Number(v)) && Number(v) >= 0 && Number(v) <= 1440),
      "Must be 0–1440",
    ),
  servings: z
    .number()
    .int()
    .min(1, "At least 1 serving")
    .max(100, "Maximum 100 servings"),
  steps: z.array(
    z.object({
      title: z.string().max(150, "Max 150 characters"),
      instruction: z.string().min(1, "Instruction is required").max(2000, "Max 2000 characters"),
      durationMinutes: z
        .string()
        .refine(
          (v) => !v || (!isNaN(Number(v)) && Number(v) >= 0 && Number(v) <= 1440),
          "Must be 0–1440",
        ),
    })
  ),
  ingredients: z.array(
    z.object({
      ingredientUuid: z.string().min(1, "Please select an ingredient"),
      quantity: z
        .string()
        .min(1, "Quantity is required")
        .refine(
          (v) => !isNaN(Number(v)) && Number(v) > 0 && Number(v) <= 99999,
          "Must be a positive number",
        ),
      unitUuid: z.string(),
      isOptional: z.boolean(),
      notes: z.string().max(250, "Max 250 characters"),
    })
  ),
});

export type CreateRecipeFormValues = z.infer<typeof createRecipeSchema>;


