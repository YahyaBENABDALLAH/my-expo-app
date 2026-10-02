import { useState } from "react";

/**
 * A custom hook to manage pull-to-refresh state and execution
 * for asynchronous operations (like TanStack Query refetching).
 *
 * @param refetch The function to call when the refresh is triggered.
 * @param onBeforeRefresh Optional callback run before the refetch starts (e.g., to reset pagination page numbers).
 */
export function usePullToRefresh(
  refetch: () => Promise<unknown>,
  onBeforeRefresh?: () => void
) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (onBeforeRefresh) {
      onBeforeRefresh();
    }
    
    const startTime = Date.now();
    try {
      await refetch();
    } catch (error) {
      console.error("Pull-to-refresh failed:", error);
    } finally {
      // UX Improvement: Guarantee a minimum spinner display time of 1000ms.
      // This prevents the spinner from flickering or instantly disappearing if the
      // API call resolves too quickly, or if page state changes are synchronous.
      const elapsedTime = Date.now() - startTime;
      const minDuration = 1000;
      if (elapsedTime < minDuration) {
        await new Promise((resolve) =>
          setTimeout(resolve, minDuration - elapsedTime)
        );
      }
      setIsRefreshing(false);
    }
  };

  return {
    isRefreshing,
    handleRefresh,
  };
}
