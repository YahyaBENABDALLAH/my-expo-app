import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useEntityInvalidation } from '../query-hooks';
import type { QuerySettings } from '../query-utils';
import type { IngredientTypeListQuery } from '@/types/ingredient-type.types';
import {
  ingredientTypeDetailOptions,
  ingredientTypeInfiniteOptions,
  ingredientTypeKeys,
  ingredientTypeListOptions,
} from './ingredient-type.queries';

export function useIngredientTypeListQuery(
  query: IngredientTypeListQuery = {},
  { enabled = true }: QuerySettings = {},
) {
  return useQuery({ ...ingredientTypeListOptions(query), enabled });
}

export function useIngredientTypeInfiniteQuery(
  query: Omit<IngredientTypeListQuery, 'page'> = {},
  { enabled = true }: QuerySettings = {},
) {
  return useInfiniteQuery({ ...ingredientTypeInfiniteOptions(query), enabled });
}

export function useIngredientTypeDetailQuery(uuid?: string | null) {
  return useQuery(ingredientTypeDetailOptions(uuid));
}

export function useInvalidateIngredientTypeQueries() {
  return useEntityInvalidation(ingredientTypeKeys);
}
