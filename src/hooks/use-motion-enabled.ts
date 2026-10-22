import { useSyncExternalStore } from 'react';
import { AccessibilityInfo, AppState } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import { useThemePreferences } from '@/context/theme.context';

type MotionState = { active: boolean; reducedMotion: boolean | undefined };
let snapshot: MotionState = {
  active: AppState.currentState === 'active',
  reducedMotion: undefined,
};
const staticSnapshot: MotionState = { active: false, reducedMotion: true };
const listeners = new Set<() => void>();
let dispose: (() => void) | undefined;

function update(next: MotionState) {
  if (snapshot.active === next.active && snapshot.reducedMotion === next.reducedMotion) return;
  snapshot = next;
  listeners.forEach((notify) => notify());
}

// All visible animation consumers share one pair of native subscriptions and
// one accessibility read. The last consumer releases them, including in Strict Mode.
function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!dispose) {
    update({ active: AppState.currentState === 'active', reducedMotion: undefined });
    let disposed = false;
    let motionSettingChanged = false;
    const motionSubscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (value) => {
        motionSettingChanged = true;
        update({ ...snapshot, reducedMotion: value });
      },
    );
    // Reanimated's synchronous hook captures the setting at app startup only.
    void AccessibilityInfo.isReduceMotionEnabled()
      .then((value) => {
        if (!disposed && !motionSettingChanged) update({ ...snapshot, reducedMotion: value });
      })
      .catch(() => {});
    const subscription = AppState.addEventListener('change', (state) =>
      update({ ...snapshot, active: state === 'active' }),
    );
    dispose = () => {
      disposed = true;
      subscription.remove();
      motionSubscription.remove();
    };
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      dispose?.();
      dispose = undefined;
      snapshot = { active: AppState.currentState === 'active', reducedMotion: undefined };
    }
  };
}

const getSnapshot = () => snapshot;
const getStaticSnapshot = () => staticSnapshot;
const subscribeStatic = () => () => {};

function useMotionState(visible: boolean) {
  // Synchronous startup fallback; live setting changes come from the shared store.
  const initialReducedMotion = useReducedMotion();
  const state = useSyncExternalStore(
    visible ? subscribe : subscribeStatic,
    visible ? getSnapshot : getStaticSnapshot,
    getStaticSnapshot,
  );
  const preferences = useThemePreferences();
  return {
    active: state.active,
    ready: preferences?.headerMotionReady ?? true,
    reducedMotion: preferences?.reducedMotion ?? state.reducedMotion ?? initialReducedMotion,
  };
}

export function useAppReducedMotion() {
  return useMotionState(true).reducedMotion;
}

export function useMotionEnabled(visible = true) {
  const state = useMotionState(visible);
  return visible && state.ready && state.active && !state.reducedMotion;
}
