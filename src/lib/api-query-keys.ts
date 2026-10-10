/** Pure identifiers shared by services, feature adapters and imperative cache operations. */
export function createEntityKeys<const T extends string>(name: T) {
  const all = [name] as const;
  return {
    all,
    lists: [...all, 'list'] as const,
    list: (params: object) => [...all, 'list', params] as const,
    infiniteLists: [...all, 'infinite'] as const,
    infiniteList: (params: object) => [...all, 'infinite', params] as const,
    details: [...all, 'detail'] as const,
    detail: (...ids: string[]) => [...all, 'detail', ...ids] as const,
    mutation: (operation: string) => [...all, 'mutation', operation] as const,
  };
}

export type EntityKeys = ReturnType<typeof createEntityKeys>;
export const chefProfileKeys = {
  ...createEntityKeys('chef-profiles'),
  forUser: (userUuid: string) => ['chef-profiles', 'for-user', userUuid.trim()] as const,
};
export const cuisineKeys = createEntityKeys('cuisines');
export const dailyRecipeStatKeys = {
  ...createEntityKeys('daily-recipe-stats'),
  today: ['daily-recipe-stats', 'today'] as const,
  last: ['daily-recipe-stats', 'last'] as const,
};
export const difficultyKeys = createEntityKeys('difficulties');
export const foodCategoryKeys = createEntityKeys('food-categories');
export const ingredientKeys = createEntityKeys('ingredients');
export const ingredientTypeKeys = createEntityKeys('ingredient-types');
export const moroccanCityKeys = createEntityKeys('moroccan-cities');
export const moroccanRegionKeys = createEntityKeys('moroccan-regions');
export const recipeKeys = {
  ...createEntityKeys('recipes'),
  // Preserve the account-scoped local collection and workflow identifiers.
  chef: chefProfileKeys.forUser,
  likes: (userUuid: string) =>
    recipeLikeKeys.list({ page: 1, pageSize: 50, userUuid: userUuid.trim() }),
  collection: (userUuid: string, kind: 'favorites' | 'history') =>
    ['recipe-collections', userUuid, kind] as const,
};
export const recipeIngredientKeys = createEntityKeys('recipe-ingredients');
export const recipeLikeKeys = createEntityKeys('recipe-likes');
export const recipeNutritionKeys = createEntityKeys('recipe-nutrition');
export const recipeShareKeys = createEntityKeys('recipe-shares');
export const recipeStepKeys = createEntityKeys('recipe-steps');
export const unitKeys = createEntityKeys('units');
