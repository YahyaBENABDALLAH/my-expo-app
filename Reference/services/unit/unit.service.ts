import { apiClient, buildListParams } from "@/services/api";
import type { UnitItem, UnitListQuery, UnitListResult } from "@/types/unit.types";

// ── List ─────────────────────────────────────────────────────

export async function getUnitListData(
  query: UnitListQuery = {},
): Promise<UnitListResult> {
  return apiClient.get<UnitListResult>("/api/Unit", {
    params: buildListParams(query),
  });
}

// ── Detail ───────────────────────────────────────────────────

export async function getUnitDetailData(uuid: string): Promise<UnitItem> {
  return apiClient.get<UnitItem>(`/api/Unit/${uuid}`);
}
