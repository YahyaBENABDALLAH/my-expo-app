import type { RecipeItem } from "@/types/recipe.types";

export const DEFAULT_RECIPE_IMAGE_URI =
  "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1400&q=80";

type RecipeImageSource = Pick<RecipeItem, "coverImageUrl" | "images">;
type RecipeDurationSource = Pick<
  RecipeItem,
  "cookTimeMinutes" | "prepTimeMinutes" | "totalTimeMinutes"
>;

export function resolveRecipeImageUri(
  recipe: RecipeImageSource,
  fallbackUri = DEFAULT_RECIPE_IMAGE_URI,
) {
  const images = recipe.images ?? [];
  const primaryImageUri = images.find(
    (image) => image.isPrimary && image.imageUrl,
  )?.imageUrl;
  const firstImageUri = images.find((image) => image.imageUrl)?.imageUrl;

  return recipe.coverImageUrl || primaryImageUri || firstImageUri || fallbackUri;
}

function toNonNegativeMinutes(value: number) {
  return Number.isFinite(value) ? Math.max(0, value) : 0;
}

export function getRecipeDurationMinutes(recipe: RecipeDurationSource) {
  const totalTimeMinutes = toNonNegativeMinutes(recipe.totalTimeMinutes);

  if (totalTimeMinutes > 0) {
    return totalTimeMinutes;
  }

  return (
    toNonNegativeMinutes(recipe.prepTimeMinutes) +
    toNonNegativeMinutes(recipe.cookTimeMinutes)
  );
}

export function formatRecipeDuration(
  recipe: RecipeDurationSource,
  { fallbackLabel = "Quick recipe" }: { fallbackLabel?: string } = {},
) {
  const durationMinutes = getRecipeDurationMinutes(recipe);
  return durationMinutes > 0 ? `${durationMinutes} min` : fallbackLabel;
}
