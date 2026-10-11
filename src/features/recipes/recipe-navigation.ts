import { router } from 'expo-router';

/** Stable screen action keeps navigation outside shared recipe presentation. */
export function openRecipe(uuid: string) {
  router.push({ pathname: '/recipe/[uuid]', params: { uuid } });
}
