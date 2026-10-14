import { ScrollView } from '@expo/ui';
import { PullToRefreshBox } from '@expo/ui/jetpack-compose';
import { fillMaxSize } from '@expo/ui/jetpack-compose/modifiers';
import { useState } from 'react';
import type { RefreshableScrollViewProps } from './refreshable-scroll-view.types';
import { usePendingRefresh } from './use-pending-refresh';

export function RefreshableScrollView({ onRefresh, ...props }: RefreshableScrollViewProps) {
  const [refreshing, setRefreshing] = useState(false);
  const refresh = usePendingRefresh(onRefresh, setRefreshing);
  if (!onRefresh || props.disabled || props.hidden) return <ScrollView {...props} />;
  return (
    <PullToRefreshBox
      isRefreshing={refreshing}
      onRefresh={refresh}
      contentAlignment="topCenter"
      modifiers={[fillMaxSize()]}
    >
      <ScrollView {...props} />
    </PullToRefreshBox>
  );
}
