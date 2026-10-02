import { apiClient, buildListParams } from "@/services/api";
import type {
    ChefProfileItem,
    ChefProfileListQuery,
    ChefProfileListResult,
    CreateChefProfilePayload,
    UpdateChefProfilePayload,
} from "@/types/chef-profile.types";

// ── List ─────────────────────────────────────────────────────

export async function getChefProfileListData(
  query: ChefProfileListQuery = {},
): Promise<ChefProfileListResult> {
  return apiClient.get<ChefProfileListResult>("/api/ChefProfile", {
    params: buildListParams(query),
  });
}

// ── Detail ───────────────────────────────────────────────────

export async function getChefProfileDetailData(
  chefProfileUuid: string,
): Promise<ChefProfileItem> {
  return apiClient.get<ChefProfileItem>(`/api/ChefProfile/${chefProfileUuid}`);
}

// ── Create (self-registration via JWT) ────────────────────────

export async function createSelfChefProfileApi(
  data: CreateChefProfilePayload,
): Promise<ChefProfileItem> {
  return apiClient.post<ChefProfileItem, CreateChefProfilePayload>(
    "/api/ChefProfile/me",
    data,
  );
}

// ── Update ───────────────────────────────────────────────────

export async function updateChefProfileApi(
  chefProfileUuid: string,
  data: UpdateChefProfilePayload,
): Promise<ChefProfileItem> {
  return apiClient.patch<ChefProfileItem, UpdateChefProfilePayload>(
    `/api/ChefProfile/${chefProfileUuid}`,
    data,
  );
}

// ── Toggle Verified ──────────────────────────────────────────

export async function toggleChefProfileVerifiedApi(
  chefProfileUuid: string,
): Promise<ChefProfileItem> {
  return apiClient.patch<ChefProfileItem>(
    `/api/ChefProfile/${chefProfileUuid}/toggle-verified`,
  );
}
