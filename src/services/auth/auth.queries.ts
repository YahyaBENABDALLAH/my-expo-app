import { queryOptions } from '@tanstack/react-query';
import { me } from './auth.api';

export const currentIdentityQuery = (userId?: string) =>
  queryOptions({
    queryKey: ['auth', 'me', userId],
    queryFn: ({ signal }) => me({ signal }),
    enabled: Boolean(userId),
  });
