import { ScrollView } from '@expo/ui';
import { refreshable } from '@expo/ui/swift-ui/modifiers';
import type { RefreshableScrollViewProps } from './refreshable-scroll-view.types';
import { usePendingRefresh } from './use-pending-refresh';

export function RefreshableScrollView({
  onRefresh,
  modifiers = [],
  ...props
}: RefreshableScrollViewProps) {
  const refresh = usePendingRefresh(onRefresh);
  // Expo UI stores this listener for native refresh events; it does not invoke it during render.
  const refreshModifier = refreshable(refresh);
  return (
    <ScrollView
      {...props}
      modifiers={
        onRefresh && !props.disabled && !props.hidden ? [...modifiers, refreshModifier] : modifiers
      }
    />
  );
}
