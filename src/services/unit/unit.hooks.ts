import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useEntityInvalidation } from '../query-hooks';
import type { QuerySettings } from '../query-utils';
import type { UnitListQuery } from '@/types/unit.types';
import { unitDetailOptions, unitInfiniteOptions, unitKeys, unitListOptions } from './unit.queries';

export function useUnitListQuery(
  query: UnitListQuery = {},
  { enabled = true }: QuerySettings = {},
) {
  return useQuery({ ...unitListOptions(query), enabled });
}

export function useUnitInfiniteQuery(
  query: Omit<UnitListQuery, 'page'> = {},
  { enabled = true }: QuerySettings = {},
) {
  return useInfiniteQuery({ ...unitInfiniteOptions(query), enabled });
}

export function useUnitDetailQuery(uuid?: string | null) {
  return useQuery(unitDetailOptions(uuid));
}

export function useInvalidateUnitQueries() {
  return useEntityInvalidation(unitKeys);
}
