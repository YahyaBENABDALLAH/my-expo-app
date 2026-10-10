// ── Pagination ───────────────────────────────────────────────
// Shared pagination types matching the API's PaginationMeta shape.
// Every paginated endpoint reuses these — no per-domain duplicates.

import type { z } from 'zod';
import type { paginationMetaSchema } from '@/validation/schemas/api/pagination';

export type PaginationMeta = z.infer<typeof paginationMetaSchema>;

export type PaginatedResponse<T> = {
  data: T[];
  meta: PaginationMeta;
};
