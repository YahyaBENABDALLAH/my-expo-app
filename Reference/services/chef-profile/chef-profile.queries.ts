import {
    keepPreviousData,
    useMutation,
    useQuery,
    useQueryClient,
    useInfiniteQuery,
} from "@tanstack/react-query";
import {
    createSelfChefProfileApi,
    getChefProfileDetailData,
    getChefProfileListData,
    toggleChefProfileVerifiedApi,
    updateChefProfileApi,
} from "./chef-profile.service";
import type {
    ChefProfileListQuery,
    CreateChefProfilePayload,
    UpdateChefProfilePayload,
} from "@/types/chef-profile.types";


// ── Query Keys ───────────────────────────────────────────────

export const chefProfileKeys = {
  all: ["chefProfiles"] as const,
  list: (query: ChefProfileListQuery) =>
    ["chefProfiles", "list", query] as const,
  detail: (uuid: string) => ["chefProfiles", "detail", uuid] as const,
};

// ── List Query Options ───────────────────────────────────────

export const getChefProfileListQueryOptions = (
  query: ChefProfileListQuery = {},
) => ({
  queryKey: chefProfileKeys.list(query),
  queryFn: () => getChefProfileListData(query),
  placeholderData: keepPreviousData,
});

// ── Detail Query Options ─────────────────────────────────────

export const getChefProfileDetailQueryOptions = (uuid: string) => ({
  queryKey: chefProfileKeys.detail(uuid),
  queryFn: () => getChefProfileDetailData(uuid),
  staleTime: 30_000,
});

// ── Hooks (convenience) ──────────────────────────────────────

export function useChefProfileListQuery(query: ChefProfileListQuery = {}) {
  return useQuery(getChefProfileListQueryOptions(query));
}

export function useChefProfileDetailQuery(uuid: string) {
  return useQuery(getChefProfileDetailQueryOptions(uuid));
}

// ── Mutations ────────────────────────────────────────────────

export function useCreateChefProfile({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
} = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateChefProfilePayload) =>
      createSelfChefProfileApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chefProfileKeys.all });
      onSuccess?.();
    },
    onError,
  });
}

export function useUpdateChefProfile({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
} = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      chefProfileUuid,
      data,
    }: {
      chefProfileUuid: string;
      data: UpdateChefProfilePayload;
    }) => updateChefProfileApi(chefProfileUuid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chefProfileKeys.all });
      onSuccess?.();
    },
    onError,
  });
}

export function useToggleChefProfileVerified({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
} = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (chefProfileUuid: string) =>
      toggleChefProfileVerifiedApi(chefProfileUuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chefProfileKeys.all });
      onSuccess?.();
    },
    onError,
  });
}

export function useChefProfileListInfiniteQuery(query: Omit<ChefProfileListQuery, "page"> = {}) {
  return useInfiniteQuery({
    queryKey: [...chefProfileKeys.all, "infinite", query],
    queryFn: ({ pageParam }) => getChefProfileListData({ ...query, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.meta.page + 1;
      return nextPage <= lastPage.meta.pageCount ? nextPage : undefined;
    },
  });
}
