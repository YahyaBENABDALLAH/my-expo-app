import type { RecipeHistoryItem } from "@/types/my-recipes.types";

export const MAX_RECIPE_HISTORY_ITEMS = 50;

function isRecipeHistoryItem(value: unknown): value is RecipeHistoryItem {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as Partial<Record<keyof RecipeHistoryItem, unknown>>;
  return (
    typeof item.id === "string" &&
    typeof item.title === "string" &&
    typeof item.imageUri === "string" &&
    typeof item.duration === "string" &&
    typeof item.calories === "string" &&
    typeof item.viewedAt === "string" &&
    (typeof item.rating === "undefined" || typeof item.rating === "string")
  );
}

export function normalizeRecipeHistory(value: unknown): RecipeHistoryItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const seen = new Set<string>();
  return value
    .filter(isRecipeHistoryItem)
    .filter((item) => {
      if (!item.id.trim() || seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    })
    .slice(0, MAX_RECIPE_HISTORY_ITEMS);
}
