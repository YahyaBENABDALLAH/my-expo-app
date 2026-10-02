import { apiClient, buildListParams } from "@/services/api";
import type {
    MoroccanRegionItem,
    MoroccanRegionListQuery,
    MoroccanRegionListResult,
} from "@/types/moroccan-region.types";

// ── List ─────────────────────────────────────────────────────

export async function getMoroccanRegionListData(
  query: MoroccanRegionListQuery = {},
): Promise<MoroccanRegionListResult> {
  return apiClient.get<MoroccanRegionListResult>("/api/MoroccanRegion", {
    params: buildListParams(query),
  });
}

// ── Detail ───────────────────────────────────────────────────

export async function getMoroccanRegionDetailData(
  uuid: string,
): Promise<MoroccanRegionItem> {
  return apiClient.get<MoroccanRegionItem>(`/api/MoroccanRegion/${uuid}`);
}
