import { apiClient, buildListParams } from "@/services/api";
import type {
    MoroccanCityItem,
    MoroccanCityListQuery,
    MoroccanCityListResult,
} from "@/types/moroccan-city.types";

// ── List ─────────────────────────────────────────────────────

export async function getMoroccanCityListData(
  query: MoroccanCityListQuery = {},
): Promise<MoroccanCityListResult> {
  return apiClient.get<MoroccanCityListResult>("/api/MoroccanCity", {
    params: buildListParams(query),
  });
}

// ── Detail ───────────────────────────────────────────────────

export async function getMoroccanCityDetailData(
  uuid: string,
): Promise<MoroccanCityItem> {
  return apiClient.get<MoroccanCityItem>(`/api/MoroccanCity/${uuid}`);
}
