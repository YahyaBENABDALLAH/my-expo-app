import { useEffect } from 'react';
import { AppState, Platform } from 'react-native';

/** Check Google Play once after startup, without delaying or blocking the app. */
export function useStoreUpdates(enabled: boolean) {
  useEffect(() => {
    if (!enabled || __DEV__ || Platform.OS !== 'android') return;

    let disposed = false;
    let attempted = false;

    async function checkForUpdate() {
      if (disposed || attempted || AppState.currentState !== 'active') return;
      attempted = true;

      try {
        // Older development clients and Expo Go do not contain this native module.
        const updates = await import('expo-in-app-updates');
        if (disposed) return;
        if (AppState.currentState !== 'active') {
          attempted = false;
          return;
        }

        const { updateAvailable } = await updates.checkForUpdate();
        if (disposed) return;
        if (AppState.currentState !== 'active') {
          attempted = false;
          return;
        }

        // Let Google Play's priority select a supported flexible/immediate flow.
        // A dismissal must not prompt again when the native dialog returns focus.
        if (updateAvailable) await updates.startUpdate();
      } catch {
        // Offline, non-Play installs and unavailable native modules must leave the
        // app usable. Another cold launch can try again.
      }
    }

    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') void checkForUpdate();
    });
    void checkForUpdate();

    return () => {
      disposed = true;
      subscription.remove();
    };
  }, [enabled]);
}
