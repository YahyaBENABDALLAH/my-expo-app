import { ingredientKeys } from '@/lib/api-query-keys';
import { detailQueryOptions, infiniteListQueryOptions, listQueryOptions } from '../query-utils';
import type { IngredientListQuery } from '@/types/ingredient.types';
import { ingredientService } from './ingredient.service';

export { ingredientKeys } from '@/lib/api-query-keys';

export function ingredientListOptions(query: IngredientListQuery = {}) {
  return listQueryOptions(ingredientKeys, query, ingredientService.list, 300000, { pageSize: 20 });
}

export function ingredientInfiniteOptions(query: Omit<IngredientListQuery, 'page'> = {}) {
  return infiniteListQueryOptions(ingredientKeys, query, ingredientService.list, 300000, {
    pageSize: 20,
  });
}

export function ingredientDetailOptions(uuid?: string | null) {
  return detailQueryOptions(
    ingredientKeys,
    [uuid],
    (ids, options) => ingredientService.detail(ids[0], options),
    300000,
  );
}
