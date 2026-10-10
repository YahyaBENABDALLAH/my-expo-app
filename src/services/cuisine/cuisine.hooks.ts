import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useEntityInvalidation } from '../query-hooks';
import type { QuerySettings } from '../query-utils';
import type { CuisineListQuery } from '@/types/cuisine.types';
import {
  cuisineDetailOptions,
  cuisineInfiniteOptions,
  cuisineKeys,
  cuisineListOptions,
} from './cuisine.queries';

export function useCuisineListQuery(
  query: CuisineListQuery = {},
  { enabled = true }: QuerySettings = {},
) {
  return useQuery({ ...cuisineListOptions(query), enabled });
}

export function useCuisineInfiniteQuery(
  query: Omit<CuisineListQuery, 'page'> = {},
  { enabled = true }: QuerySettings = {},
) {
  return useInfiniteQuery({ ...cuisineInfiniteOptions(query), enabled });
}

export function useCuisineDetailQuery(uuid?: string | null) {
  return useQuery(cuisineDetailOptions(uuid));
}

export function useInvalidateCuisineQueries() {
  return useEntityInvalidation(cuisineKeys);
}
