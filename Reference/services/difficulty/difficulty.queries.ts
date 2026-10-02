import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
    getDifficultyDetailData,
    getDifficultyListData,
} from "./difficulty.service";
import type { DifficultyListQuery } from "@/types/difficulty.types";

// ── Query Keys ───────────────────────────────────────────────

export const difficultyKeys = {
  all: ["difficulties"] as const,
  list: (query: DifficultyListQuery) =>
    ["difficulties", "list", query] as const,
  detail: (uuid: string) => ["difficulties", "detail", uuid] as const,
};

// ── List Query Options ───────────────────────────────────────

export const getDifficultyListQueryOptions = (
  query: DifficultyListQuery = {},
) => ({
  queryKey: difficultyKeys.list(query),
  queryFn: () => getDifficultyListData(query),
  placeholderData: keepPreviousData,
  staleTime: 30 * 60_000,
  refetchOnWindowFocus: false,
});

// ── Detail Query Options ─────────────────────────────────────

export const getDifficultyDetailQueryOptions = (uuid: string) => ({
  queryKey: difficultyKeys.detail(uuid),
  queryFn: () => getDifficultyDetailData(uuid),
  staleTime: 30_000,
});

// ── Hooks ────────────────────────────────────────────────────

export function useDifficultyListQuery(
  query: DifficultyListQuery = {},
  { enabled = true }: { enabled?: boolean } = {},
) {
  return useQuery({
    ...getDifficultyListQueryOptions(query),
    enabled,
  });
}

export function useDifficultyDetailQuery(uuid: string) {
  return useQuery(getDifficultyDetailQueryOptions(uuid));
}
