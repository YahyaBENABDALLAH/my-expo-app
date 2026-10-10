import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useEntityInvalidation } from '../query-hooks';
import type { QuerySettings } from '../query-utils';
import type { MoroccanCityListQuery } from '@/types/moroccan-city.types';
import {
  moroccanCityDetailOptions,
  moroccanCityInfiniteOptions,
  moroccanCityKeys,
  moroccanCityListOptions,
} from './moroccan-city.queries';

export function useMoroccanCityListQuery(
  query: MoroccanCityListQuery = {},
  { enabled = true }: QuerySettings = {},
) {
  return useQuery({ ...moroccanCityListOptions(query), enabled });
}

export function useMoroccanCityInfiniteQuery(
  query: Omit<MoroccanCityListQuery, 'page'> = {},
  { enabled = true }: QuerySettings = {},
) {
  return useInfiniteQuery({ ...moroccanCityInfiniteOptions(query), enabled });
}

export function useMoroccanCityDetailQuery(uuid?: string | null) {
  return useQuery(moroccanCityDetailOptions(uuid));
}

export function useInvalidateMoroccanCityQueries() {
  return useEntityInvalidation(moroccanCityKeys);
}
