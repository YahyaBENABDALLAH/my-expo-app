import AsyncStorage from '@react-native-async-storage/async-storage';
import { queryOptions } from '@tanstack/react-query';
import { z } from 'zod';
import type { RecipeItem } from '@/types/recipe.types';
import { recipeKeys } from './query-keys';

const cardSchema = z.object({
  uuid: z.string().min(1),
  title: z.string(),
  coverImageUrl: z.string().nullable(),
  totalTimeMinutes: z.number(),
  difficultyName: z.string().nullable(),
  likesCount: z.number(),
  chefDisplayName: z.string().nullable(),
});
const collectionSchema = z.array(cardSchema);
export type CollectionKind = 'favorites' | 'history';
const operations = new Map<string, Promise<void>>();
function storageKey(user: string, kind: CollectionKind) {
  return `recipes:${user}:${kind}`;
}
async function readCollection(key: string) {
  const saved = await AsyncStorage.getItem(key);
  return saved ? collectionSchema.parse(JSON.parse(saved)) : [];
}
export function collectionOptions(user: string, kind: CollectionKind) {
  return queryOptions({
    queryKey: recipeKeys.collection(user, kind),
    queryFn: () => readCollection(storageKey(user, kind)),
    enabled: Boolean(user),
    networkMode: 'always',
    staleTime: Infinity,
  });
}

export function updateCollection(
  user: string,
  kind: CollectionKind,
  recipe?: RecipeItem,
  remove = false,
) {
  if (!user) return Promise.reject(new Error('recipes.loginSave'));
  const key = storageKey(user, kind);
  const operation = (operations.get(key) ?? Promise.resolve())
    .catch(() => {})
    .then(async () => {
      const items = await readCollection(key);
      const filtered = recipe ? items.filter((item) => item.uuid !== recipe.uuid) : [];
      const next =
        recipe && !remove ? [cardSchema.parse(recipe), ...filtered].slice(0, 50) : filtered;
      await AsyncStorage.setItem(key, JSON.stringify(next));
    });
  operations.set(key, operation);
  void operation
    .finally(() => {
      if (operations.get(key) === operation) operations.delete(key);
    })
    .catch(() => {});
  return operation;
}
