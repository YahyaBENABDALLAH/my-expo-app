import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useEntityInvalidation } from '../query-hooks';
import type { QuerySettings } from '../query-utils';
import type { DifficultyListQuery } from '@/types/difficulty.types';
import {
  difficultyDetailOptions,
  difficultyInfiniteOptions,
  difficultyKeys,
  difficultyListOptions,
} from './difficulty.queries';

export function useDifficultyListQuery(
  query: DifficultyListQuery = {},
  { enabled = true }: QuerySettings = {},
) {
  return useQuery({ ...difficultyListOptions(query), enabled });
}

export function useDifficultyInfiniteQuery(
  query: Omit<DifficultyListQuery, 'page'> = {},
  { enabled = true }: QuerySettings = {},
) {
  return useInfiniteQuery({ ...difficultyInfiniteOptions(query), enabled });
}

export function useDifficultyDetailQuery(uuid?: string | null) {
  return useQuery(difficultyDetailOptions(uuid));
}

export function useInvalidateDifficultyQueries() {
  return useEntityInvalidation(difficultyKeys);
}
