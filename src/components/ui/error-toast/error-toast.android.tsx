import { useThemeColors } from '@/hooks/use-theme';
import { Snackbar, SnackbarHost, type SnackbarHostRef } from '@expo/ui/jetpack-compose';
import { fillMaxWidth } from '@expo/ui/jetpack-compose/modifiers';
import { useEffect, useRef } from 'react';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { UniversalHost } from '../host/universal-host';
import type { ErrorToastProps } from './error-toast.types';

export function ErrorToast({ message, onDismiss, colorScheme }: ErrorToastProps) {
  const scheme = useColorScheme(colorScheme);
  const colors = useThemeColors(scheme);
  const ref = useRef<SnackbarHostRef>(null);
  const shown = useRef(false);
  const dismiss = useRef(onDismiss);
  useEffect(() => {
    dismiss.current = onDismiss;
    // React Strict Mode replays effects; enqueue this native snackbar only once.
    if (shown.current || !ref.current) return;
    shown.current = true;
    void ref.current.showSnackbar({ message, duration: 'long', withDismissAction: true }).then(
      () => dismiss.current(),
      () => dismiss.current(),
    );
  }, [message, onDismiss]);
  return (
    <UniversalHost colorScheme={scheme} ignoreSafeArea="all">
      <SnackbarHost ref={ref} modifiers={[fillMaxWidth()]}>
        <Snackbar
          containerColor={colors.surface}
          contentColor={colors.error}
          dismissActionContentColor={colors.text}
        />
      </SnackbarHost>
    </UniversalHost>
  );
}
