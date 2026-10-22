/** Pure identifiers shared by services, feature adapters and imperative cache operations. */
export function createEntityKeys<const T extends string>(name: T) {
  const all = [name] as const;
  return {
    all,
    lists: [...all, 'list'] as const,
    list: (params: object) => [...all, 'list', params] as const,
    infiniteLists: [...all, 'infinite'] as const,
    infiniteList: (params: object) => [...all, 'infinite', params] as const,
    details: [...all, 'detail'] as const,
    detail: (...ids: string[]) => [...all, 'detail', ...ids] as const,
    mutation: (operation: string) => [...all, 'mutation', operation] as const,
  };
}

export type EntityKeys = ReturnType<typeof createEntityKeys>;
