import type { PaginatedResponse } from "@/types/pagination.types";

export interface RecipeDetailStep {
  stepNumber: number;
  title: string;
  instruction: string;
  durationMinutes: number | null;
}

export interface RecipeDetailIngredient {
  ingredientName: string;
  quantity: number | null;
  unitLabel: string | null;
  isOptional: boolean;
  notes: string | null;
  sortOrder: number;
}

export interface RecipeImageItem {
  imageUrl: string | null;
  altText: string | null;
  isPrimary: boolean;
  sortOrder: number;
}

export interface RecipeDetailNutrition {
  caloriesPerServing: number | null;
  proteinGrams: number | null;
  carbsGrams: number | null;
  fatGrams: number | null;
}

export interface RecipeItem {
  uuid: string;
  code: string;
  title: string;
  slug: string;
  summary: string;
  coverImageUrl: string | null;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  totalTimeMinutes: number;
  servings: number;
  status: string | null;
  visibility: string | null;
  isActive: boolean;
  dateInsert: string | null;
  dateModif: string | null;
  publishedAt: string | null;
  difficultyName: string | null;
  cuisineName: string | null;
  cityName: string | null;
  chefDisplayName: string | null;
  chefUuid: string | null;
  likesCount: number;
  categories: string[] | null;
  steps: RecipeDetailStep[] | null;
  ingredients: RecipeDetailIngredient[] | null;
  images: RecipeImageItem[] | null;
  nutrition: RecipeDetailNutrition | null;
}

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
