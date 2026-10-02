import {
  loadFavoriteRecipeUuids,
  saveFavoriteRecipeUuids,
} from "@/lib/favorites-storage";
import { useCallback, useEffect, useMemo, useSyncExternalStore } from "react";

interface FavoritesSnapshot {
  error: Error | null;
  favorites: string[];
  isLoading: boolean;
}

type FavoritesListener = () => void;

let snapshot: FavoritesSnapshot = {
  error: null,
  favorites: [],
  isLoading: true,
};
let hydrationPromise: Promise<void> | null = null;
let isHydrated = false;
let mutationQueue: Promise<void> = Promise.resolve();
const listeners = new Set<FavoritesListener>();

function getSnapshot() {
  return snapshot;
}

function subscribe(listener: FavoritesListener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function publish(nextSnapshot: FavoritesSnapshot) {
  snapshot = nextSnapshot;
  listeners.forEach((listener) => listener());
}

function toError(cause: unknown, fallbackMessage: string) {
  return cause instanceof Error ? cause : new Error(fallbackMessage);
}

function ensureFavoritesLoaded() {
  if (isHydrated) {
    return Promise.resolve();
  }

  if (!hydrationPromise) {
    hydrationPromise = loadFavoriteRecipeUuids()
      .then((favorites) => {
        isHydrated = true;
        publish({ error: null, favorites, isLoading: false });
      })
      .catch((cause: unknown) => {
        const error = toError(cause, "Unable to load favorites");
        isHydrated = true;
        publish({ error, favorites: [], isLoading: false });
        console.error("Failed to load favorites:", error);
      });
  }

  return hydrationPromise;
}

function enqueueMutation<T>(operation: () => Promise<T>) {
  const result = mutationQueue.then(operation, operation);
  mutationQueue = result.then(
    () => undefined,
    () => undefined,
  );
  return result;
}

function toggleStoredFavorite(recipeUuid: string) {
  const normalizedRecipeUuid = recipeUuid.trim();

  if (!normalizedRecipeUuid) {
    return Promise.resolve(false);
  }

  return enqueueMutation(async () => {
    await ensureFavoritesLoaded();

    const previousFavorites = snapshot.favorites;
    const nextFavorites = previousFavorites.includes(normalizedRecipeUuid)
      ? previousFavorites.filter((uuid) => uuid !== normalizedRecipeUuid)
      : [...previousFavorites, normalizedRecipeUuid];

    publish({ error: null, favorites: nextFavorites, isLoading: false });

    try {
      await saveFavoriteRecipeUuids(nextFavorites);

      return true;
    } catch (cause) {
      const error = toError(cause, "Unable to save favorites");

      publish({ error, favorites: previousFavorites, isLoading: false });
      console.error("Failed to toggle favorite:", error);
      return false;
    }
  });
}

function clearStoredFavorites() {
  return enqueueMutation(async () => {
    await ensureFavoritesLoaded();
    const previousFavorites = snapshot.favorites;
    const nextFavorites: string[] = [];

    publish({ error: null, favorites: nextFavorites, isLoading: false });

    try {
      await saveFavoriteRecipeUuids(nextFavorites);
      return true;
    } catch (cause) {
      const error = toError(cause, "Unable to clear favorites");

      publish({ error, favorites: previousFavorites, isLoading: false });
      console.error("Failed to clear favorites:", error);
      return false;
    }
  });
}

export function useFavorites() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const favoriteSet = useMemo(
    () => new Set(state.favorites),
    [state.favorites],
  );

  useEffect(() => {
    void ensureFavoritesLoaded();
  }, []);

  const isFavorite = useCallback(
    (recipeUuid: string) => favoriteSet.has(recipeUuid),
    [favoriteSet],
  );

  return {
    clearFavorites: clearStoredFavorites,
    error: state.error,
    favorites: state.favorites,
    isFavorite,
    isLoading: state.isLoading,
    toggleFavorite: toggleStoredFavorite,
  };
}
