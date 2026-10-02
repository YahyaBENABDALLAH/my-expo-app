import type { RecipeHistoryItem } from "@/types/my-recipes.types";
import { normalizeRecipeHistory } from "@/lib/recipe-history";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RECIPE_HISTORY_STORAGE_KEY = "@foodiya:recipe-history";
export async function loadRecipeHistory() {
  const storedValue = await AsyncStorage.getItem(RECIPE_HISTORY_STORAGE_KEY);
  return storedValue
    ? normalizeRecipeHistory(JSON.parse(storedValue) as unknown)
    : [];
}

export async function saveRecipeHistory(items: readonly RecipeHistoryItem[]) {
  await AsyncStorage.setItem(
    RECIPE_HISTORY_STORAGE_KEY,
    JSON.stringify(normalizeRecipeHistory(items)),
  );
}
