import { ingredientTypeKeys } from '@/lib/api-query-keys';
import { detailQueryOptions, infiniteListQueryOptions, listQueryOptions } from '../query-utils';
import type { IngredientTypeListQuery } from '@/types/ingredient-type.types';
import { ingredientTypeService } from './ingredient-type.service';

export { ingredientTypeKeys } from '@/lib/api-query-keys';

export function ingredientTypeListOptions(query: IngredientTypeListQuery = {}) {
  return listQueryOptions(ingredientTypeKeys, query, ingredientTypeService.list, 300000, {
    pageSize: 20,
  });
}

export function ingredientTypeInfiniteOptions(query: Omit<IngredientTypeListQuery, 'page'> = {}) {
  return infiniteListQueryOptions(ingredientTypeKeys, query, ingredientTypeService.list, 300000, {
    pageSize: 20,
  });
}

export function ingredientTypeDetailOptions(uuid?: string | null) {
  return detailQueryOptions(
    ingredientTypeKeys,
    [uuid],
    (ids, options) => ingredientTypeService.detail(ids[0], options),
    300000,
  );
}
