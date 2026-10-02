import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
    getMoroccanCityDetailData,
    getMoroccanCityListData,
} from "./moroccan-city.service";
import type { MoroccanCityListQuery } from "@/types/moroccan-city.types";

// ── Query Keys ───────────────────────────────────────────────

export const moroccanCityKeys = {
  all: ["moroccan-cities"] as const,
  list: (query: MoroccanCityListQuery) =>
    ["moroccan-cities", "list", query] as const,
  detail: (uuid: string) => ["moroccan-cities", "detail", uuid] as const,
};

// ── List Query Options ───────────────────────────────────────

export const getMoroccanCityListQueryOptions = (
  query: MoroccanCityListQuery = {},
) => ({
  queryKey: moroccanCityKeys.list(query),
  queryFn: () => getMoroccanCityListData(query),
  placeholderData: keepPreviousData,
});

// ── Detail Query Options ─────────────────────────────────────

export const getMoroccanCityDetailQueryOptions = (uuid: string) => ({
  queryKey: moroccanCityKeys.detail(uuid),
  queryFn: () => getMoroccanCityDetailData(uuid),
  staleTime: 30_000,
});

// ── Hooks ────────────────────────────────────────────────────

export function useMoroccanCityListQuery(query: MoroccanCityListQuery = {}) {
  return useQuery(getMoroccanCityListQueryOptions(query));
}

export function useMoroccanCityDetailQuery(uuid: string) {
  return useQuery(getMoroccanCityDetailQueryOptions(uuid));
}
