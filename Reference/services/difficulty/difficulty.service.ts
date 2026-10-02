import { apiClient, buildListParams } from "@/services/api";
import type {
    DifficultyItem,
    DifficultyListQuery,
    DifficultyListResult,
} from "@/types/difficulty.types";

// ── List ─────────────────────────────────────────────────────

export async function getDifficultyListData(
  query: DifficultyListQuery = {},
): Promise<DifficultyListResult> {
  return apiClient.get<DifficultyListResult>("/api/Difficulty", {
    params: buildListParams(query),
  });
}

// ── Detail ───────────────────────────────────────────────────

export async function getDifficultyDetailData(
  uuid: string,
): Promise<DifficultyItem> {
  return apiClient.get<DifficultyItem>(`/api/Difficulty/${uuid}`);
}
