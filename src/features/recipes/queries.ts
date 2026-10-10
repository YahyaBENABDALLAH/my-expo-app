import { foodCategoryListOptions } from '@/services/food-category/food-category.queries';
import { cuisineListOptions } from '@/services/cuisine/cuisine.queries';
import { difficultyListOptions } from '@/services/difficulty/difficulty.queries';
import { ingredientListOptions } from '@/services/ingredient/ingredient.queries';
import { unitListOptions } from '@/services/unit/unit.queries';
import { recipeLikeListOptions } from '@/services/recipe-like/recipe-like.queries';
import type { listQueryOptions } from '@/services/query-utils';
import type { LookupItem, LookupKind } from '@/types/lookup.types';

export { recipeListOptions, recipeDetailOptions } from '@/services/recipe/recipe.queries';
export { chefProfileForUserOptions as chefProfileOptions } from '@/services/chef-profile/chef-profile.queries';

const lookups = {
  FoodCategory: foodCategoryListOptions,
  Cuisine: cuisineListOptions,
  Difficulty: difficultyListOptions,
  Ingredient: ingredientListOptions,
  Unit: unitListOptions,
};

export function lookupOptions(kind: LookupKind, page = 1, search = '') {
  const params = { page, pageSize: 20, isActive: true, search };
  // Validated catalog entities expose a common set of display fields to recipe screens.
  return lookups[kind](params) as ReturnType<typeof listQueryOptions<LookupItem, typeof params>>;
}

export function lookupLabel(item: LookupItem) {
  return item.name ?? item.label ?? item.uuid;
}

export function likedOptions(userUuid: string) {
  return {
    ...recipeLikeListOptions({ userUuid, pageSize: 50 }),
    enabled: Boolean(userUuid),
  };
}
