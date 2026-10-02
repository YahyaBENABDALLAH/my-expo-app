import type { PaginatedResponse } from "@/types/pagination.types";

// ── Item ─────────────────────────────────────────────────────

export type ChefProfileItem = {
  uuid: string;
  userUuid: string;
  displayName: string;
  bio: string | null;
  specialty: string | null;
  yearsOfExperience: number | null;
  isVerified: boolean;
  dateInsert: string;
  userName: string | null;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  email: string | null;
  color: string | null;
  profileImageUrl: string | null;
  code: string | null;
  codeAlpha: string | null;
};

// ── Query ────────────────────────────────────────────────────

export type ChefProfileListQuery = {
  page?: number;
  pageSize?: number;
  isVerified?: boolean;
  search?: string;
};

// ── Payloads ─────────────────────────────────────────────────

export type CreateChefProfilePayload = {
  displayName: string;
  bio?: string | null;
  specialty?: string | null;
  yearsOfExperience?: number | null;
};

export type UpdateChefProfilePayload = {
  displayName?: string | null;
  bio?: string | null;
  specialty?: string | null;
  yearsOfExperience?: number | null;
};

// ── Response ─────────────────────────────────────────────────

export type ChefProfileListResult = PaginatedResponse<ChefProfileItem>;
