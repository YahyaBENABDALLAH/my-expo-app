import { z } from 'zod';
import { paginatedResponseSchema } from './pagination';

export const recipeDetailStepSchema = z.looseObject({
  stepNumber: z.number(),
  title: z.string(),
  instruction: z.string(),
  durationMinutes: z.number().nullable(),
});

export const recipeDetailIngredientSchema = z.looseObject({
  ingredientName: z.string(),
  quantity: z.number().nullable(),
  unitLabel: z.string().nullable(),
  isOptional: z.boolean(),
  notes: z.string().nullable(),
  sortOrder: z.number(),
});

export const recipeImageItemSchema = z.looseObject({
  imageUrl: z.string().nullable(),
  altText: z.string().nullable(),
  isPrimary: z.boolean(),
  sortOrder: z.number(),
});

export const recipeDetailNutritionSchema = z.looseObject({
  caloriesPerServing: z.number().nullable(),
  proteinGrams: z.number().nullable(),
  carbsGrams: z.number().nullable(),
  fatGrams: z.number().nullable(),
});

export const recipeItemSchema = z.looseObject({
  uuid: z.string().min(1),
  code: z.string(),
  title: z.string(),
  slug: z.string(),
  summary: z.string(),
  coverImageUrl: z.string().nullable(),
  prepTimeMinutes: z.number(),
  cookTimeMinutes: z.number(),
  totalTimeMinutes: z.number(),
  servings: z.number(),
  status: z.string().nullable(),
  visibility: z.string().nullable(),
  isActive: z.boolean(),
  dateInsert: z.string().nullable(),
  dateModif: z.string().nullable(),
  publishedAt: z.string().nullable(),
  difficultyName: z.string().nullable(),
  cuisineName: z.string().nullable(),
  cityName: z.string().nullable(),
  chefDisplayName: z.string().nullable(),
  chefUuid: z.string().min(1).nullable(),
  likesCount: z.number(),
  categories: z.array(z.string()).nullable(),
  steps: z.array(recipeDetailStepSchema).nullable(),
  ingredients: z.array(recipeDetailIngredientSchema).nullable(),
  images: z.array(recipeImageItemSchema).nullable(),
  nutrition: recipeDetailNutritionSchema.nullable(),
});

export const recipeListSchema = paginatedResponseSchema(recipeItemSchema);
