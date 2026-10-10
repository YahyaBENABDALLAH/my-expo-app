import { useSyncExternalStore } from 'react';

import { useMotionEnabled } from '@/hooks/use-motion-enabled';

export const SKELETON_PULSE_DURATION_MS = 900;
export const SKELETON_DIMMED_OPACITY = 0.45;

// Expo UI animates each transition natively. Share one endpoint clock across
// mounted placeholders; never send frame-by-frame updates through React.
const listeners = new Set<() => void>();
let dimmed = false;
let timer: ReturnType<typeof setInterval> | undefined;

function subscribe(listener: () => void) {
  listeners.add(listener);
  timer ??= setInterval(() => {
    dimmed = !dimmed;
    listeners.forEach((notify) => notify());
  }, SKELETON_PULSE_DURATION_MS);

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      clearInterval(timer);
      timer = undefined;
      dimmed = false;
    }
  };
}

const getSnapshot = () => dimmed;
const getStaticSnapshot = () => false;
const subscribeStatic = () => () => {};

export function useSkeletonPulse(animate: boolean) {
  const enabled = useMotionEnabled(animate);
  const pulseDimmed = useSyncExternalStore(
    enabled ? subscribe : subscribeStatic,
    enabled ? getSnapshot : getStaticSnapshot,
    getStaticSnapshot,
  );

  return { enabled, dimmed: pulseDimmed };
}
