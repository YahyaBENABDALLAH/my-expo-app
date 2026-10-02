import { keepPreviousData, useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { getCuisineDetailData, getCuisineListData } from "./cuisine.service";
import type { CuisineListQuery } from "@/types/cuisine.types";

// ── Query Keys ───────────────────────────────────────────────

export const cuisineKeys = {
  list: (query: CuisineListQuery) => ["cuisines", "list", query] as const,
  detail: (cuisineUuid: string) => ["cuisines", "detail", cuisineUuid] as const,
};

// ── List Query Options ───────────────────────────────────────

export const getCuisineListQueryOptions = (query: CuisineListQuery = {}) => ({
  queryKey: cuisineKeys.list(query),
  queryFn: () => getCuisineListData(query),
  placeholderData: keepPreviousData,
  staleTime: 30 * 60_000,
  refetchOnWindowFocus: false,
});

// ── Detail Query Options ─────────────────────────────────────

export const getCuisineDetailQueryOptions = (cuisineUuid: string) => ({
  queryKey: cuisineKeys.detail(cuisineUuid),
  queryFn: () => getCuisineDetailData(cuisineUuid),
  staleTime: 30_000,
});

// ── Hooks (convenience) ──────────────────────────────────────

export function useCuisineListQuery(
  query: CuisineListQuery = {},
  { enabled = true }: { enabled?: boolean } = {},
) {
  return useQuery({
    ...getCuisineListQueryOptions(query),
    enabled,
  });
}

export function useCuisineDetailQuery(cuisineUuid: string) {
  return useQuery(getCuisineDetailQueryOptions(cuisineUuid));
}

export function useCuisineListInfiniteQuery(query: Omit<CuisineListQuery, "page"> = {}) {
  return useInfiniteQuery({
    queryKey: ["cuisines", "infinite", query],
    queryFn: ({ pageParam }) => getCuisineListData({ ...query, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.meta.page + 1;
      return nextPage <= lastPage.meta.pageCount ? nextPage : undefined;
    },
  });
}
