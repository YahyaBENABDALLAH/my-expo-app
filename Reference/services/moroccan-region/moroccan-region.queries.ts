import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
    getMoroccanRegionDetailData,
    getMoroccanRegionListData,
} from "./moroccan-region.service";
import type { MoroccanRegionListQuery } from "@/types/moroccan-region.types";

// ── Query Keys ───────────────────────────────────────────────

export const moroccanRegionKeys = {
  all: ["moroccan-regions"] as const,
  list: (query: MoroccanRegionListQuery) =>
    ["moroccan-regions", "list", query] as const,
  detail: (uuid: string) => ["moroccan-regions", "detail", uuid] as const,
};

// ── List Query Options ───────────────────────────────────────

export const getMoroccanRegionListQueryOptions = (
  query: MoroccanRegionListQuery = {},
) => ({
  queryKey: moroccanRegionKeys.list(query),
  queryFn: () => getMoroccanRegionListData(query),
  placeholderData: keepPreviousData,
});

// ── Detail Query Options ─────────────────────────────────────

export const getMoroccanRegionDetailQueryOptions = (uuid: string) => ({
  queryKey: moroccanRegionKeys.detail(uuid),
  queryFn: () => getMoroccanRegionDetailData(uuid),
  staleTime: 30_000,
});

// ── Hooks ────────────────────────────────────────────────────

export function useMoroccanRegionListQuery(
  query: MoroccanRegionListQuery = {},
) {
  return useQuery(getMoroccanRegionListQueryOptions(query));
}

export function useMoroccanRegionDetailQuery(uuid: string) {
  return useQuery(getMoroccanRegionDetailQueryOptions(uuid));
}
