import { useEffect, useState } from "react";

export function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const normalizedDelay = Number.isFinite(delayMs) ? Math.max(0, delayMs) : 0;

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, normalizedDelay);

    return () => clearTimeout(timeout);
  }, [normalizedDelay, value]);

  return debouncedValue;
}
