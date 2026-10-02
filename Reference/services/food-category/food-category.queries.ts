import { keepPreviousData, useQuery, useInfiniteQuery } from "@tanstack/react-query";
import {
    getFoodCategoryDetailData,
    getFoodCategoryListData,
} from "./food-category.service";
import type { FoodCategoryListQuery } from "@/types/food-category.types";

// ── Query Keys ───────────────────────────────────────────────

export const foodCategoryKeys = {
  all: ["food-categories"] as const,
  list: (query: FoodCategoryListQuery) =>
    ["food-categories", "list", query] as const,
  detail: (uuid: string) => ["food-categories", "detail", uuid] as const,
};

// ── List Query Options ───────────────────────────────────────

export const getFoodCategoryListQueryOptions = (
  query: FoodCategoryListQuery = {},
) => ({
  queryKey: foodCategoryKeys.list(query),
  queryFn: () => getFoodCategoryListData(query),
  placeholderData: keepPreviousData,
  staleTime: 30 * 60_000,
  refetchOnWindowFocus: false,
});

// ── Detail Query Options ─────────────────────────────────────

export const getFoodCategoryDetailQueryOptions = (uuid: string) => ({
  queryKey: foodCategoryKeys.detail(uuid),
  queryFn: () => getFoodCategoryDetailData(uuid),
  staleTime: 30_000,
});

// ── Hooks ────────────────────────────────────────────────────

export function useFoodCategoryListQuery(query: FoodCategoryListQuery = {}) {
  return useQuery(getFoodCategoryListQueryOptions(query));
}

export function useFoodCategoryDetailQuery(uuid: string) {
  return useQuery(getFoodCategoryDetailQueryOptions(uuid));
}

export function useFoodCategoryListInfiniteQuery(query: Omit<FoodCategoryListQuery, "page"> = {}) {
  return useInfiniteQuery({
    queryKey: [...foodCategoryKeys.all, "infinite", query],
    queryFn: ({ pageParam }) => getFoodCategoryListData({ ...query, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.meta.page + 1;
      return nextPage <= lastPage.meta.pageCount ? nextPage : undefined;
    },
  });
}
