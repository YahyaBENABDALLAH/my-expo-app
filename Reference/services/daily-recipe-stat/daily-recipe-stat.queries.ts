import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
    getDailyRecipeStatDetailData,
    getDailyRecipeStatLastData,
    getDailyRecipeStatListData,
    getDailyRecipeStatTodayData,
} from "./daily-recipe-stat.service";
import type { DailyRecipeStatListQuery } from "@/types/daily-recipe-stat.types";

// ── Query Keys ───────────────────────────────────────────────

export const dailyRecipeStatKeys = {
  list: (query: DailyRecipeStatListQuery) =>
    ["daily-recipe-stats", "list", query] as const,
  detail: (uuid: string) => ["daily-recipe-stats", "detail", uuid] as const,
  today: () => ["daily-recipe-stats", "today"] as const,
  last: () => ["daily-recipe-stats", "last"] as const,
};

// ── List Query Options ───────────────────────────────────────

export const getDailyRecipeStatListQueryOptions = (
  query: DailyRecipeStatListQuery = {},
) => ({
  queryKey: dailyRecipeStatKeys.list(query),
  queryFn: () => getDailyRecipeStatListData(query),
  placeholderData: keepPreviousData,
});

// ── Detail Query Options ─────────────────────────────────────

export const getDailyRecipeStatDetailQueryOptions = (uuid: string) => ({
  queryKey: dailyRecipeStatKeys.detail(uuid),
  queryFn: () => getDailyRecipeStatDetailData(uuid),
  staleTime: 30_000,
});

// ── Today Query Options ──────────────────────────────────────

export const getDailyRecipeStatTodayQueryOptions = () => ({
  queryKey: dailyRecipeStatKeys.today(),
  queryFn: () => getDailyRecipeStatTodayData(),
  staleTime: 5 * 60_000, // 5 min — stats generated once per day
});

// ── Last Query Options ───────────────────────────────────────

export const getDailyRecipeStatLastQueryOptions = () => ({
  queryKey: dailyRecipeStatKeys.last(),
  queryFn: () => getDailyRecipeStatLastData(),
  staleTime: 5 * 60_000,
});

// ── Hooks ────────────────────────────────────────────────────

export function useDailyRecipeStatListQuery(
  query: DailyRecipeStatListQuery = {},
) {
  return useQuery(getDailyRecipeStatListQueryOptions(query));
}

export function useDailyRecipeStatDetailQuery(uuid: string) {
  return useQuery(getDailyRecipeStatDetailQueryOptions(uuid));
}

export function useDailyRecipeStatTodayQuery() {
  return useQuery(getDailyRecipeStatTodayQueryOptions());
}

export function useDailyRecipeStatLastQuery() {
  return useQuery(getDailyRecipeStatLastQueryOptions());
}
