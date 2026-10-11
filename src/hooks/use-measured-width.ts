import { useCallback, useRef, useState } from 'react';

/** Native geometry may report the same width when only its position changes. */
export function useMeasuredWidth() {
  const [width, setWidth] = useState(0);
  const measured = useRef(0);
  const updateWidth = useCallback((next: number) => {
    if (!Number.isFinite(next) || next < 0 || next === measured.current) return;
    measured.current = next;
    setWidth(next);
  }, []);
  return [width, updateWidth] as const;
}
