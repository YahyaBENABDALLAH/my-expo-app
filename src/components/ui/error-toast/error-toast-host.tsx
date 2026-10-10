import { useCallback, useSyncExternalStore } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { dismissErrorToast, getErrorToast, subscribeErrorToasts } from '@/lib/error-toasts';
import { ErrorToast } from './error-toast';

/** Lives above navigation so errors survive auth redirects and screen changes. */
export function ErrorToastHost() {
  const toast = useSyncExternalStore(subscribeErrorToasts, getErrorToast);
  const insets = useSafeAreaInsets();
  const id = toast?.id;
  const dismiss = useCallback(() => {
    if (id !== undefined) dismissErrorToast(id);
  }, [id]);
  if (!toast) return null;
  return (
    <View
      testID="error-toast"
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        top: insets.top + 12,
        left: insets.left + 16,
        right: insets.right + 16,
      }}
    >
      <ErrorToast key={toast.id} message={toast.message} onDismiss={dismiss} />
    </View>
  );
}
