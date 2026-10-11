import { useCallback, useRef } from 'react';

/** Coalesce native refresh gestures and always release the indicator after settlement. */
export function usePendingRefresh(
  onRefresh: (() => Promise<void>) | undefined,
  onRefreshingChange?: (refreshing: boolean) => void,
) {
  const pending = useRef<Promise<void> | null>(null);
  return useCallback(() => {
    if (pending.current) return pending.current;
    onRefreshingChange?.(true);
    pending.current = Promise.resolve()
      .then(onRefresh)
      .catch(() => {
        // The consumer displays its query's error; native completion must remain safe.
      })
      .finally(() => {
        pending.current = null;
        onRefreshingChange?.(false);
      });
    return pending.current;
  }, [onRefresh, onRefreshingChange]);
}
