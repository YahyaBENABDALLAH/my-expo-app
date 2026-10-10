import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useEntityInvalidation } from '../query-hooks';
import type { QuerySettings } from '../query-utils';
import type { MoroccanRegionListQuery } from '@/types/moroccan-region.types';
import {
  moroccanRegionDetailOptions,
  moroccanRegionInfiniteOptions,
  moroccanRegionKeys,
  moroccanRegionListOptions,
} from './moroccan-region.queries';

export function useMoroccanRegionListQuery(
  query: MoroccanRegionListQuery = {},
  { enabled = true }: QuerySettings = {},
) {
  return useQuery({ ...moroccanRegionListOptions(query), enabled });
}

export function useMoroccanRegionInfiniteQuery(
  query: Omit<MoroccanRegionListQuery, 'page'> = {},
  { enabled = true }: QuerySettings = {},
) {
  return useInfiniteQuery({ ...moroccanRegionInfiniteOptions(query), enabled });
}

export function useMoroccanRegionDetailQuery(uuid?: string | null) {
  return useQuery(moroccanRegionDetailOptions(uuid));
}

export function useInvalidateMoroccanRegionQueries() {
  return useEntityInvalidation(moroccanRegionKeys);
}
