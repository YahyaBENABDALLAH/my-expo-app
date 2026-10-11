import { useEffect } from 'react';
import { AccessibilityInfo, Platform } from 'react-native';

const DISMISS_DELAY = 6000;

/** Keep transient notifications available while assistive technology is reading them. */
export function useToastLifetime(message: string, onDismiss: () => void) {
  useEffect(() => {
    let active = true;
    let revision = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const update = (screenReader: boolean) => {
      const currentRevision = ++revision;
      clearTimeout(timer);
      if (!active) return;
      if (screenReader) {
        AccessibilityInfo.announceForAccessibility(message);
        return;
      }
      const schedule = (delay: number) => {
        if (active && revision === currentRevision) timer = setTimeout(onDismiss, delay);
      };
      if (Platform.OS === 'android') {
        void AccessibilityInfo.getRecommendedTimeoutMillis(DISMISS_DELAY).then(schedule, () =>
          schedule(DISMISS_DELAY),
        );
      } else {
        schedule(DISMISS_DELAY);
      }
    };
    const subscription = AccessibilityInfo.addEventListener('screenReaderChanged', update);
    const initialRevision = revision;
    void AccessibilityInfo.isScreenReaderEnabled().then(
      (enabled) => {
        if (revision === initialRevision) update(enabled);
      },
      () => {
        if (revision === initialRevision) update(false);
      },
    );
    return () => {
      active = false;
      clearTimeout(timer);
      subscription.remove();
    };
  }, [message, onDismiss]);
}
