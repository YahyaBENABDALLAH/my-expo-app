import {
  infiniteQueryOptions,
  queryOptions,
  skipToken,
  type UseMutationOptions,
} from '@tanstack/react-query';
import { normalizeListQuery, type ApiReadOptions, type PaginationQuery } from './request-utils';
import type { EntityKeys } from '@/lib/api-query-keys';
import type { PaginatedResponse } from '@/types/pagination.types';

export type QuerySettings = { enabled?: boolean };
export type MutationCallbacks<TData, TVariables> = Pick<
  UseMutationOptions<TData, Error, TVariables>,
  'onSuccess' | 'onError' | 'onSettled'
>;

export function listQueryOptions<TItem, TQuery extends PaginationQuery>(
  keys: EntityKeys,
  query: TQuery,
  fetchList: (query: TQuery, options: ApiReadOptions) => Promise<PaginatedResponse<TItem>>,
  staleTime = 60_000,
  defaults: PaginationQuery = {},
) {
  const params = normalizeListQuery(query, defaults);
  return queryOptions({
    queryKey: keys.list(params),
    queryFn: ({ signal }) => fetchList(params, { signal }),
    staleTime,
  });
}

export function infiniteListQueryOptions<TItem, TQuery extends PaginationQuery>(
  keys: EntityKeys,
  query: TQuery,
  fetchList: (query: TQuery, options: ApiReadOptions) => Promise<PaginatedResponse<TItem>>,
  staleTime = 60_000,
  defaults: PaginationQuery = {},
) {
  const params = normalizeListQuery({ ...query, page: 1 }, defaults);
  return infiniteQueryOptions({
    queryKey: keys.infiniteList(params),
    queryFn: ({ pageParam, signal }) => fetchList({ ...params, page: pageParam }, { signal }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, _pages, lastPageParam) =>
      lastPage.data.length > 0 &&
      lastPage.meta.hasNextPage &&
      lastPage.meta.page === lastPageParam &&
      lastPage.meta.page < lastPage.meta.pageCount
        ? lastPageParam + 1
        : undefined,
    staleTime,
  });
}

export function detailQueryOptions<TItem>(
  keys: EntityKeys,
  ids: (string | null | undefined)[],
  fetchDetail: (ids: string[], options: ApiReadOptions) => Promise<TItem>,
  staleTime = 60_000,
) {
  const normalized = ids.map((id) => id?.trim() ?? '');
  const valid = normalized.every(Boolean);
  return queryOptions({
    queryKey: keys.detail(...normalized),
    queryFn: valid ? ({ signal }) => fetchDetail(normalized, { signal }) : skipToken,
    enabled: valid,
    staleTime,
  });
}

/** Consumer callbacks run after mandatory cache maintenance and cannot replace it. */
export function withMutationCallbacks<TData, TVariables>(
  base: UseMutationOptions<TData, Error, TVariables>,
  callbacks: MutationCallbacks<TData, TVariables> = {},
): UseMutationOptions<TData, Error, TVariables> {
  return {
    ...base,
    onSuccess: async (...args) => {
      await base.onSuccess?.(...args);
      await callbacks.onSuccess?.(...args);
    },
    onError: async (...args) => {
      await base.onError?.(...args);
      await callbacks.onError?.(...args);
    },
    onSettled: async (...args) => {
      await base.onSettled?.(...args);
      await callbacks.onSettled?.(...args);
    },
  };
}
