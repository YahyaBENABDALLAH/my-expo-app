import { z } from 'zod';

export const paginationMetaSchema = z.looseObject({
  page: z.number().int().positive(),
  take: z.number().int().positive(),
  itemCount: z.number().int().nonnegative(),
  pageCount: z.number().int().nonnegative(),
  hasPreviousPage: z.boolean(),
  hasNextPage: z.boolean(),
});

export function paginatedResponseSchema<T extends z.ZodType>(item: T) {
  return z.looseObject({ data: z.array(item), meta: paginationMetaSchema });
}
