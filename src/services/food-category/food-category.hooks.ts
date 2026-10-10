import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useEntityInvalidation } from '../query-hooks';
import type { QuerySettings } from '../query-utils';
import type { FoodCategoryListQuery } from '@/types/food-category.types';
import {
  foodCategoryDetailOptions,
  foodCategoryInfiniteOptions,
  foodCategoryKeys,
  foodCategoryListOptions,
} from './food-category.queries';

export function useFoodCategoryListQuery(
  query: FoodCategoryListQuery = {},
  { enabled = true }: QuerySettings = {},
) {
  return useQuery({ ...foodCategoryListOptions(query), enabled });
}

export function useFoodCategoryInfiniteQuery(
  query: Omit<FoodCategoryListQuery, 'page'> = {},
  { enabled = true }: QuerySettings = {},
) {
  return useInfiniteQuery({ ...foodCategoryInfiniteOptions(query), enabled });
}

export function useFoodCategoryDetailQuery(uuid?: string | null) {
  return useQuery(foodCategoryDetailOptions(uuid));
}

export function useInvalidateFoodCategoryQueries() {
  return useEntityInvalidation(foodCategoryKeys);
}
