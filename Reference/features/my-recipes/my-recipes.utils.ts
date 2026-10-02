import { formatRecipeDuration, resolveRecipeImageUri } from "@/lib/recipe";
import type { MyRecipeCardItem } from "@/types/my-recipes.types";
import type { RecipeItem } from "@/types/recipe.types";

export function toMyRecipeCardItem(
  recipe: RecipeItem,
  options: Pick<MyRecipeCardItem, "isFavorite" | "isLiked" | "isMyRecipe">,
): MyRecipeCardItem {
  return {
    calories: recipe.nutrition?.caloriesPerServing
      ? `${Math.round(recipe.nutrition.caloriesPerServing)} kcal`
      : "— kcal",
    duration: formatRecipeDuration(recipe),
    id: recipe.uuid,
    imageUri: resolveRecipeImageUri(recipe),
    title: recipe.title,
    ...options,
  };
}
