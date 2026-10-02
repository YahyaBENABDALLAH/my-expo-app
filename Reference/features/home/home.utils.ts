import { getInitialsAvatarUrl } from "@/lib/avatar";
import {
  formatRecipeDuration,
  resolveRecipeImageUri,
} from "@/lib/recipe";
import type { EditorsChoiceRecipe, PopularRecipe } from "@/types/home.types";
import type { RecipeItem } from "@/types/recipe.types";

export function toPopularRecipe(recipe: RecipeItem): PopularRecipe {
  const chefAvatarUrl = getInitialsAvatarUrl(recipe.chefDisplayName);

  return {
    uuid: recipe.uuid,
    title: recipe.title,
    imageUri: resolveRecipeImageUri(recipe),
    duration: formatRecipeDuration(recipe),
    subtitle:
      recipe.cuisineName ??
      recipe.difficultyName ??
      "Published recipe",
    popularityLabel: recipe.likesCount > 0 ? String(recipe.likesCount) : "New",
    isFavorite: false,
    chefName: recipe.chefDisplayName,
    chefAvatarUrl,
  };
}

export function toEditorsChoiceRecipe(recipe: RecipeItem): EditorsChoiceRecipe {
  const caloriesPerServing = recipe.nutrition?.caloriesPerServing;
  const hasCalories = typeof caloriesPerServing === "number";
  const chefName = recipe.chefDisplayName;
  const chefAvatarUrl = getInitialsAvatarUrl(chefName);

  return {
    uuid: recipe.uuid,
    label: recipe.difficultyName ?? recipe.cuisineName ?? "Featured",
    title: recipe.title,
    description: recipe.summary || "A published recipe ready to try.",
    imageUri: resolveRecipeImageUri(recipe),
    duration: formatRecipeDuration(recipe),
    secondaryMeta: hasCalories
      ? `${Math.round(caloriesPerServing)} kcal`
      : (recipe.cuisineName ?? "Chef selection"),
    secondaryMetaKind: hasCalories ? "flame" : "star",
    chefName,
    chefAvatarUrl,
  };
}
