import { mutationOptions, type QueryKey } from '@tanstack/react-query';
import { assertSessionVersion, getSessionVersion } from './auth/auth.session';

/** Never replay an offline write under another login, or apply a late response to its cache. */
export function sessionMutationOptions<TData, TVariables>(
  key: QueryKey,
  write: (variables: TVariables, version: number) => Promise<TData>,
  maintainCache: (data: TData, variables: TVariables, assertCurrent: () => void) => Promise<void>,
) {
  const version = getSessionVersion();
  return mutationOptions<TData, Error, TVariables>({
    mutationKey: key,
    retry: 0,
    networkMode: 'always',
    mutationFn: async (variables) => {
      assertSessionVersion(version);
      const data = await write(variables, version);
      assertSessionVersion(version);
      return data;
    },
    onSuccess: async (data, variables) => {
      assertSessionVersion(version);
      await maintainCache(data, variables, () => assertSessionVersion(version));
      assertSessionVersion(version);
    },
  });
}
