import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEntityInvalidation } from '../query-hooks';
import { withMutationCallbacks, type MutationCallbacks, type QuerySettings } from '../query-utils';
import type {
  ChefProfileItem,
  ChefProfileListQuery,
  CreateChefProfilePayload,
} from '@/types/chef-profile.types';
import {
  chefProfileDetailOptions,
  chefProfileForUserOptions,
  chefProfileInfiniteOptions,
  chefProfileKeys,
  chefProfileListOptions,
} from './chef-profile.queries';
import {
  createChefProfileMutationOptions,
  updateChefProfileMutationOptions,
  toggleChefProfileVerifiedMutationOptions,
  type UpdateChefProfileVariables,
} from './chef-profile.mutations';

export function useChefProfileListQuery(
  query: ChefProfileListQuery = {},
  { enabled = true }: QuerySettings = {},
) {
  return useQuery({ ...chefProfileListOptions(query), enabled });
}

export function useChefProfileInfiniteQuery(
  query: Omit<ChefProfileListQuery, 'page'> = {},
  { enabled = true }: QuerySettings = {},
) {
  return useInfiniteQuery({ ...chefProfileInfiniteOptions(query), enabled });
}

export function useChefProfileDetailQuery(uuid?: string | null) {
  return useQuery(chefProfileDetailOptions(uuid));
}

export function useInvalidateChefProfileQueries() {
  return useEntityInvalidation(chefProfileKeys);
}

export function useChefProfileForUserQuery(userUuid?: string | null) {
  return useQuery(chefProfileForUserOptions(userUuid));
}

export function useCreateChefProfileMutation(
  callbacks: MutationCallbacks<ChefProfileItem, CreateChefProfilePayload> = {},
) {
  const client = useQueryClient();
  return useMutation(withMutationCallbacks(createChefProfileMutationOptions(client), callbacks));
}

export function useUpdateChefProfileMutation(
  callbacks: MutationCallbacks<ChefProfileItem, UpdateChefProfileVariables> = {},
) {
  const client = useQueryClient();
  return useMutation(withMutationCallbacks(updateChefProfileMutationOptions(client), callbacks));
}

export function useToggleChefProfileVerifiedMutation(
  callbacks: MutationCallbacks<ChefProfileItem, string> = {},
) {
  const client = useQueryClient();
  return useMutation(
    withMutationCallbacks(toggleChefProfileVerifiedMutationOptions(client), callbacks),
  );
}
