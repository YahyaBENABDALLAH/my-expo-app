import { queryOptions } from '@tanstack/react-query';
import { dailyRecipeStatKeys } from '@/lib/api-query-keys';
import { detailQueryOptions, infiniteListQueryOptions, listQueryOptions } from '../query-utils';
import type { DailyRecipeStatListQuery } from '@/types/daily-recipe-stat.types';
import { dailyRecipeStatService } from './daily-recipe-stat.service';

export { dailyRecipeStatKeys } from '@/lib/api-query-keys';

export function dailyRecipeStatTodayOptions() {
  return queryOptions({
    queryKey: dailyRecipeStatKeys.today,
    queryFn: ({ signal }) => dailyRecipeStatService.today({ signal }),
    staleTime: 60_000,
  });
}

export function dailyRecipeStatLastOptions() {
  return queryOptions({
    queryKey: dailyRecipeStatKeys.last,
    queryFn: ({ signal }) => dailyRecipeStatService.last({ signal }),
    staleTime: 60_000,
  });
}

export function dailyRecipeStatListOptions(query: DailyRecipeStatListQuery = {}) {
  return listQueryOptions(dailyRecipeStatKeys, query, dailyRecipeStatService.list, 60000, {});
}

export function dailyRecipeStatInfiniteOptions(query: Omit<DailyRecipeStatListQuery, 'page'> = {}) {
  return infiniteListQueryOptions(
    dailyRecipeStatKeys,
    query,
    dailyRecipeStatService.list,
    60000,
    {},
  );
}

export function dailyRecipeStatDetailOptions(uuid?: string | null) {
  return detailQueryOptions(
    dailyRecipeStatKeys,
    [uuid],
    (ids, options) => dailyRecipeStatService.detail(ids[0], options),
    60000,
  );
}
