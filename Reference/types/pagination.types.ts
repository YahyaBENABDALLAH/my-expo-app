// ── Pagination ───────────────────────────────────────────────
// Shared pagination types matching the API's PaginationMeta shape.
// Every paginated endpoint reuses these — no per-domain duplicates.

export type PaginationMeta = {
  page: number;
  take: number;
  itemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: PaginationMeta;
};
