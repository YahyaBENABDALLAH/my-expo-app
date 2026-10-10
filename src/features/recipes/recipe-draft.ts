import { z } from 'zod';

const minutes = z.coerce.number().finite().int().min(0).max(1440);
export const recipeInfoSchema = z.object({
  title: z.string().trim().min(1, 'recipeForm.titleRequired').max(200),
  summary: z.string().trim().max(1000),
});
export const recipeDetailsSchema = z.object({
  difficultyUuid: z.uuid('recipeForm.difficultyRequired'),
  cuisineUuid: z.union([z.uuid(), z.literal('')]),
  prepTimeMinutes: minutes,
  cookTimeMinutes: minutes,
  servings: z.coerce.number().finite().int().min(1).max(100),
});
export const recipeIngredientsSchema = z.object({
  ingredients: z
    .array(
      z.object({
        ingredientUuid: z.uuid('recipeForm.ingredientRequired'),
        quantity: z.coerce.number().finite().positive().max(99999),
        unitUuid: z.union([z.uuid(), z.literal('')]),
      }),
    )
    .min(1, 'recipeForm.ingredientsRequired'),
});
export const recipeStepsSchema = z.object({
  steps: z
    .array(
      z.object({
        instruction: z.string().trim().min(1, 'recipeForm.instructionRequired').max(2000),
      }),
    )
    .min(1, 'recipeForm.stepsRequired'),
});
export const recipeDraftSchema = recipeInfoSchema
  .extend(recipeDetailsSchema.shape)
  .extend(recipeIngredientsSchema.shape)
  .extend(recipeStepsSchema.shape);

export type RecipeDraft = {
  title: string;
  summary: string;
  difficultyUuid: string;
  cuisineUuid: string;
  prepTimeMinutes: string;
  cookTimeMinutes: string;
  servings: string;
  ingredients: { id: number; ingredientUuid: string; quantity: string; unitUuid: string }[];
  steps: { id: number; instruction: string }[];
};
export const emptyRecipeDraft: RecipeDraft = {
  title: '',
  summary: '',
  difficultyUuid: '',
  cuisineUuid: '',
  prepTimeMinutes: '0',
  cookTimeMinutes: '0',
  servings: '5',
  ingredients: [],
  steps: [],
};
export const recipeStepSchemas = [
  recipeInfoSchema,
  recipeDetailsSchema,
  recipeIngredientsSchema,
  recipeStepsSchema,
] as const;

export function recipeBody(draft: RecipeDraft) {
  const parsed = recipeDraftSchema.parse(draft);
  return {
    ...parsed,
    cuisineUuid: parsed.cuisineUuid || null,
    ingredients: parsed.ingredients.map((item, index) => ({
      ...item,
      unitUuid: item.unitUuid || null,
      sortOrder: index,
      isOptional: false,
    })),
    steps: parsed.steps.map((item, index) => ({ ...item, stepNumber: index + 1 })),
  };
}
