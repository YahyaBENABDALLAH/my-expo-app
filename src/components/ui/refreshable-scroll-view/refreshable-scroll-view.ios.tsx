import { useThemeColors } from '@/hooks/use-theme';
import { ScrollView } from '@expo/ui';
import { refreshable, tint } from '@expo/ui/swift-ui/modifiers';
import { useHostColorScheme } from '../host/universal-host';
import type { RefreshableScrollViewProps } from './refreshable-scroll-view.types';
import { usePendingRefresh } from './use-pending-refresh';

export function RefreshableScrollView({
  onRefresh,
  modifiers = [],
  ...props
}: RefreshableScrollViewProps) {
  const colors = useThemeColors(useHostColorScheme());
  const refresh = usePendingRefresh(onRefresh);
  // Expo UI stores this listener for native refresh events; it does not invoke it during render.
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
