import { useCallback, useSyncExternalStore } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { dismissToast, getToast, subscribeToasts } from '@/lib/toasts';
import { Toast } from './toast';

/** Lives above navigation so notifications survive auth redirects and screen changes. */
export function ToastHost() {
  const toast = useSyncExternalStore(subscribeToasts, getToast);
  const insets = useSafeAreaInsets();
  const id = toast?.id;
  const dismiss = useCallback(() => {
    if (id !== undefined) dismissToast(id);
  }, [id]);
  if (!toast) return null;
  return (
    <View
      testID="toast"
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        top: insets.top + 12,
        left: insets.left + 16,
        right: insets.right + 16,
      }}
    >
      <Toast
        key={toast.id}
        variant={toast.variant}
        title={toast.title}
        message={toast.message}
        onDismiss={dismiss}
      />
    </View>
  );
}
