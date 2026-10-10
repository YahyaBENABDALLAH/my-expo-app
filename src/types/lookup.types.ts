/** Common display fields used by the recipe form's catalog selectors. */
export type LookupItem = {
  uuid: string;
  name?: string | null;
  label?: string | null;
  defaultUnitUuid?: string | null;
};
export type LookupKind = 'FoodCategory' | 'Cuisine' | 'Difficulty' | 'Ingredient' | 'Unit';
