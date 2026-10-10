import { useEffect, useState } from 'react';
import { AccessibilityInfo, AppState } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

export function useMotionEnabled(visible = true) {
  const initialReducedMotion = useReducedMotion();
  const [reducedMotion, setReducedMotion] = useState(initialReducedMotion);
  const [active, setActive] = useState(AppState.currentState === 'active');
  useEffect(() => {
    let disposed = false;
    let motionSettingChanged = false;
    const motionSubscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (value) => {
        motionSettingChanged = true;
        setReducedMotion(value);
      },
    );
    // Reanimated's synchronous hook captures the setting at app startup only.
    void AccessibilityInfo.isReduceMotionEnabled()
      .then((value) => {
        if (!disposed && !motionSettingChanged) setReducedMotion(value);
      })
      .catch(() => {});
    const subscription = AppState.addEventListener('change', (state) =>
      setActive(state === 'active'),
    );
    return () => {
      disposed = true;
      subscription.remove();
      motionSubscription.remove();
    };
  }, []);
  return visible && active && !reducedMotion;
}
