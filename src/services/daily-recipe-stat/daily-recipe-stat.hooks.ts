import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useEntityInvalidation } from '../query-hooks';
import type { QuerySettings } from '../query-utils';
import type { DailyRecipeStatListQuery } from '@/types/daily-recipe-stat.types';
import {
  dailyRecipeStatDetailOptions,
  dailyRecipeStatInfiniteOptions,
  dailyRecipeStatKeys,
  dailyRecipeStatListOptions,
  dailyRecipeStatTodayOptions,
  dailyRecipeStatLastOptions,
} from './daily-recipe-stat.queries';

export function useDailyRecipeStatListQuery(
  query: DailyRecipeStatListQuery = {},
  { enabled = true }: QuerySettings = {},
) {
  return useQuery({ ...dailyRecipeStatListOptions(query), enabled });
}

export function useDailyRecipeStatInfiniteQuery(
  query: Omit<DailyRecipeStatListQuery, 'page'> = {},
  { enabled = true }: QuerySettings = {},
) {
  return useInfiniteQuery({ ...dailyRecipeStatInfiniteOptions(query), enabled });
}

export function useDailyRecipeStatDetailQuery(uuid?: string | null) {
  return useQuery(dailyRecipeStatDetailOptions(uuid));
}

export function useInvalidateDailyRecipeStatQueries() {
  return useEntityInvalidation(dailyRecipeStatKeys);
}

export function useDailyRecipeStatTodayQuery({ enabled = true }: QuerySettings = {}) {
  return useQuery({ ...dailyRecipeStatTodayOptions(), enabled });
}

export function useDailyRecipeStatLastQuery({ enabled = true }: QuerySettings = {}) {
  return useQuery({ ...dailyRecipeStatLastOptions(), enabled });
}
