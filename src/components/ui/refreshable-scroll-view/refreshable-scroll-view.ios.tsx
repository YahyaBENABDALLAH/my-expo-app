import { useThemeColors } from '@/hooks/use-theme';
import { ScrollView } from '@expo/ui';
import { refreshable, tint } from '@expo/ui/swift-ui/modifiers';
import { useCallback, useRef } from 'react';
import { useHostColorScheme } from '../host/universal-host';
import type { RefreshableScrollViewProps } from './refreshable-scroll-view.types';

export function RefreshableScrollView({
  onRefresh,
  modifiers = [],
  ...props
}: RefreshableScrollViewProps) {
  const colors = useThemeColors(useHostColorScheme());
  const pending = useRef<Promise<void> | null>(null);
  const refresh = useCallback(() => {
    if (pending.current) return pending.current;
    pending.current = Promise.resolve()
      .then(onRefresh)
      .catch(() => {
        // Keep refresh completion safe; the consumer displays its query's error.
      })
      .finally(() => {
        pending.current = null;
      });
    return pending.current;
  }, [onRefresh]);
  // Expo UI stores this listener for native refresh events; it does not invoke it during render.
  // eslint-disable-next-line react-hooks/refs
  const refreshModifier = refreshable(refresh);
  return (
    <ScrollView
      {...props}
      modifiers={
        onRefresh && !props.disabled && !props.hidden
          ? [tint(colors.tint), ...modifiers, refreshModifier]
          : modifiers
      }
    />
  );
}
