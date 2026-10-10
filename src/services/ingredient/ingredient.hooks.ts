import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useEntityInvalidation } from '../query-hooks';
import type { QuerySettings } from '../query-utils';
import type { IngredientListQuery } from '@/types/ingredient.types';
import {
  ingredientDetailOptions,
  ingredientInfiniteOptions,
  ingredientKeys,
  ingredientListOptions,
} from './ingredient.queries';

export function useIngredientListQuery(
  query: IngredientListQuery = {},
  { enabled = true }: QuerySettings = {},
) {
  return useQuery({ ...ingredientListOptions(query), enabled });
}

export function useIngredientInfiniteQuery(
  query: Omit<IngredientListQuery, 'page'> = {},
  { enabled = true }: QuerySettings = {},
) {
  return useInfiniteQuery({ ...ingredientInfiniteOptions(query), enabled });
}

export function useIngredientDetailQuery(uuid?: string | null) {
  return useQuery(ingredientDetailOptions(uuid));
}

export function useInvalidateIngredientQueries() {
  return useEntityInvalidation(ingredientKeys);
}
