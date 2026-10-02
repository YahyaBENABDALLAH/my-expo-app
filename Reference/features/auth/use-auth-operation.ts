import { useCallback, useEffect, useRef, useState } from "react";

/** Loading and duplicate-submit protection belong to each form instance. */
export function useAuthOperation() {
  const [isLoading, setLoading] = useState(false);
  const mounted = useRef(true);
  const pending = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      pending.current = false;
    };
  }, []);

  const execute = useCallback(async (operation: () => Promise<void>) => {
    if (!mounted.current || pending.current) return;
    pending.current = true;
    setLoading(true);

    try {
      await operation();
    } finally {
      pending.current = false;
      if (mounted.current) setLoading(false);
    }
  }, []);

  return { execute, isLoading };
}
