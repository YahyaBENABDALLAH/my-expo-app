import { useThemeColors } from '@/hooks/use-theme';
import { ScrollView } from '@expo/ui';
import { PullToRefreshBox } from '@expo/ui/jetpack-compose';
import { fillMaxSize } from '@expo/ui/jetpack-compose/modifiers';
import { useRef, useState } from 'react';
import { useHostColorScheme } from '../host/universal-host';
import type { RefreshableScrollViewProps } from './refreshable-scroll-view.types';

export function RefreshableScrollView({ onRefresh, ...props }: RefreshableScrollViewProps) {
  const colors = useThemeColors(useHostColorScheme());
  const [refreshing, setRefreshing] = useState(false);
  const pending = useRef<Promise<void> | null>(null);
  const refresh = () => {
    if (!onRefresh || pending.current) return;
    setRefreshing(true);
    pending.current = Promise.resolve()
      .then(onRefresh)
      .catch(() => {
        // Keep refresh completion safe; the consumer displays its query's error.
      })
      .finally(() => {
        pending.current = null;
        setRefreshing(false);
      });
  };
  if (!onRefresh || props.disabled || props.hidden) return <ScrollView {...props} />;
  return (
    <PullToRefreshBox
      isRefreshing={refreshing}
      onRefresh={refresh}
      contentAlignment="topCenter"
      modifiers={[fillMaxSize()]}
      indicator={{
        color: colors.tint,
        containerColor: colors.surface,
      }}
    >
      <ScrollView {...props} />
    </PullToRefreshBox>
  );
}
