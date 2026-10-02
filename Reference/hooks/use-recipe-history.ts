import {
  loadRecipeHistory,
  saveRecipeHistory,
} from "@/lib/recipe-history-storage";
import { formatRecipeDuration, resolveRecipeImageUri } from "@/lib/recipe";
import type { RecipeHistoryItem } from "@/types/my-recipes.types";
import type { RecipeItem } from "@/types/recipe.types";
import { useEffect, useSyncExternalStore } from "react";

interface RecipeHistorySnapshot {
  error: Error | null;
  isLoading: boolean;
  items: RecipeHistoryItem[];
}

let snapshot: RecipeHistorySnapshot = {
  error: null,
  isLoading: true,
  items: [],
};
let hydrationPromise: Promise<void> | null = null;
let isHydrated = false;
let mutationQueue = Promise.resolve();
const listeners = new Set<() => void>();

function getSnapshot() {
  return snapshot;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function publish(nextSnapshot: RecipeHistorySnapshot) {
  snapshot = nextSnapshot;
  listeners.forEach((listener) => listener());
}

function toError(cause: unknown, fallback: string) {
  return cause instanceof Error ? cause : new Error(fallback);
}

function ensureLoaded() {
  if (isHydrated) {
    return Promise.resolve();
  }

  if (!hydrationPromise) {
    hydrationPromise = loadRecipeHistory()
      .then((items) => {
        isHydrated = true;
        publish({ error: null, isLoading: false, items });
      })
      .catch((cause: unknown) => {
        isHydrated = true;
        publish({
          error: toError(cause, "Unable to load recipe history"),
          isLoading: false,
          items: [],
        });
      });
  }

  return hydrationPromise;
}

function enqueueMutation(operation: () => Promise<void>) {
  mutationQueue = mutationQueue.then(operation, operation);
  return mutationQueue;
}

function persist(nextItems: RecipeHistoryItem[], previousItems: RecipeHistoryItem[]) {
  publish({ error: null, isLoading: false, items: nextItems });

  return saveRecipeHistory(nextItems).catch((cause: unknown) => {
    publish({
      error: toError(cause, "Unable to save recipe history"),
      isLoading: false,
      items: previousItems,
    });
  });
}

export function recordRecipeView(recipe: RecipeItem) {
  return enqueueMutation(async () => {
    await ensureLoaded();
    const previousItems = snapshot.items;
    const item: RecipeHistoryItem = {
      calories: recipe.nutrition?.caloriesPerServing
        ? `${Math.round(recipe.nutrition.caloriesPerServing)} kcal`
        : "— kcal",
      duration: formatRecipeDuration(recipe),
      id: recipe.uuid,
      imageUri: resolveRecipeImageUri(recipe),
      title: recipe.title,
      viewedAt: new Date().toISOString(),
    };
    const nextItems = [item, ...previousItems.filter(({ id }) => id !== item.id)];
    await persist(nextItems.slice(0, 50), previousItems);
  });
}

export function clearRecipeHistory() {
  return enqueueMutation(async () => {
    await ensureLoaded();
    await persist([], snapshot.items);
  });
}

export function useRecipeHistory() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  useEffect(() => {
    void ensureLoaded();
  }, []);

  return {
    clearHistory: clearRecipeHistory,
    error: state.error,
    isLoading: state.isLoading,
    items: state.items,
    recordView: recordRecipeView,
  };
}
