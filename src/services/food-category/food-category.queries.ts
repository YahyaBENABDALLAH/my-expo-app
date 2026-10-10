import { foodCategoryKeys } from '@/lib/api-query-keys';
import { detailQueryOptions, infiniteListQueryOptions, listQueryOptions } from '../query-utils';
import type { FoodCategoryListQuery } from '@/types/food-category.types';
import { foodCategoryService } from './food-category.service';

export { foodCategoryKeys } from '@/lib/api-query-keys';

export function foodCategoryListOptions(query: FoodCategoryListQuery = {}) {
  return listQueryOptions(foodCategoryKeys, query, foodCategoryService.list, 300000, {
    pageSize: 20,
  });
}

export function foodCategoryInfiniteOptions(query: Omit<FoodCategoryListQuery, 'page'> = {}) {
  return infiniteListQueryOptions(foodCategoryKeys, query, foodCategoryService.list, 300000, {
    pageSize: 20,
  });
}

export function foodCategoryDetailOptions(uuid?: string | null) {
  return detailQueryOptions(
    foodCategoryKeys,
    [uuid],
    (ids, options) => foodCategoryService.detail(ids[0], options),
    300000,
  );
}
