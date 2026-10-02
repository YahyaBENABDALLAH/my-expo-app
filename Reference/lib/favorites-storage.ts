import AsyncStorage from "@react-native-async-storage/async-storage";
import { normalizeFavoriteRecipeUuids } from "@/lib/favorites";

const FAVORITES_STORAGE_KEY = "@foodiya:favorites";

export async function loadFavoriteRecipeUuids() {
  const storedValue = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);

  if (!storedValue) {
    return [];
  }

  return normalizeFavoriteRecipeUuids(JSON.parse(storedValue) as unknown);
}

export async function saveFavoriteRecipeUuids(recipeUuids: readonly string[]) {
  const normalizedRecipeUuids = normalizeFavoriteRecipeUuids(recipeUuids);
  await AsyncStorage.setItem(
    FAVORITES_STORAGE_KEY,
    JSON.stringify(normalizedRecipeUuids),
  );
}
