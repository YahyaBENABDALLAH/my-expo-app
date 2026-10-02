export interface RecipeCardItem {
  id: string;
  title: string;
  imageUri: string;
  duration: string;
  calories: string;
  rating?: string;
}

export interface MyRecipeCardItem extends RecipeCardItem {
  isFavorite: boolean;
  isLiked: boolean;
  isMyRecipe: boolean;
}

export interface RecipeHistoryItem extends RecipeCardItem {
  /** ISO timestamp used for sorting and locale-aware relative formatting. */
  viewedAt: string;
}
