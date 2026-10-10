import type { z } from 'zod';
import type {
  recipeDetailStepSchema,
  recipeDetailIngredientSchema,
  recipeImageItemSchema,
  recipeDetailNutritionSchema,
  recipeItemSchema,
} from '@/validation/schemas/api/recipe';
import type { PaginatedResponse } from '@/types/pagination.types';

export type RecipeDetailStep = z.infer<typeof recipeDetailStepSchema>;

export type RecipeDetailIngredient = z.infer<typeof recipeDetailIngredientSchema>;

export type RecipeImageItem = z.infer<typeof recipeImageItemSchema>;

export type RecipeDetailNutrition = z.infer<typeof recipeDetailNutritionSchema>;

export type RecipeItem = z.infer<typeof recipeItemSchema>;

export type RecipeCardData = Pick<
  RecipeItem,
  | 'uuid'
  | 'title'
  | 'coverImageUrl'
  | 'totalTimeMinutes'
  | 'difficultyName'
  | 'likesCount'
  | 'chefDisplayName'
>;

export interface RecipeListQuery {
  page?: number;
  pageSize?: number;
  cuisineUuid?: string;
  difficultyUuid?: string;
  categoryUuid?: string;
  search?: string;
}

export type RecipeListResult = PaginatedResponse<RecipeItem>;

// ── Create Recipe ────────────────────────────────────────────

export interface CreateRecipeStepBody {
  stepNumber?: number;
  title?: string | null;
  instruction: string;
  durationMinutes?: number | null;
}

export interface CreateRecipeIngredientBody {
  ingredientUuid: string;
  quantity?: number;
  unitUuid?: string | null;
  isOptional?: boolean;
  notes?: string | null;
  sortOrder?: number;
}

export interface CreateRecipeBody {
  title: string;
  summary?: string | null;
  difficultyUuid: string;
  cuisineUuid?: string | null;
  cityUuid?: string | null;
  prepTimeMinutes?: number;
  cookTimeMinutes?: number;
  servings?: number;
  coverImageUrl?: string | null;
  status?: string | null;
  isActive?: boolean;
  foodCategoryUuids?: string[] | null;
  steps?: CreateRecipeStepBody[] | null;
  ingredients?: CreateRecipeIngredientBody[] | null;
}
