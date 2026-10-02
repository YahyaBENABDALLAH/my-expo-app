import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getUnitDetailData, getUnitListData } from "./unit.service";
import type { UnitListQuery } from "@/types/unit.types";

// ── Query Keys ───────────────────────────────────────────────

export const unitKeys = {
  all: ["units"] as const,
  list: (query: UnitListQuery) => ["units", "list", query] as const,
  detail: (uuid: string) => ["units", "detail", uuid] as const,
};

// ── List Query Options ───────────────────────────────────────

export const getUnitListQueryOptions = (query: UnitListQuery = {}) => ({
  queryKey: unitKeys.list(query),
  queryFn: () => getUnitListData(query),
  placeholderData: keepPreviousData,
  staleTime: 30 * 60_000,
  refetchOnWindowFocus: false,
});

// ── Detail Query Options ─────────────────────────────────────

export const getUnitDetailQueryOptions = (uuid: string) => ({
  queryKey: unitKeys.detail(uuid),
  queryFn: () => getUnitDetailData(uuid),
  staleTime: 30_000,
});

// ── Hooks ────────────────────────────────────────────────────

export function useUnitListQuery(query: UnitListQuery = {}) {
  return useQuery(getUnitListQueryOptions(query));
}

export function useUnitDetailQuery(uuid: string) {
  return useQuery(getUnitDetailQueryOptions(uuid));
}
