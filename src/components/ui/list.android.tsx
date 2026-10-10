import { useThemeColors } from '@/hooks/use-theme';
import type { ListProps } from '@expo/ui';
import { LazyColumn, PullToRefreshBox } from '@expo/ui/jetpack-compose';
import { background, testID as nativeTestID } from '@expo/ui/jetpack-compose/modifiers';
import { useRef, useState } from 'react';
import { useHostColorScheme } from './universal-host';

export function List({ children, onRefresh, testID }: ListProps) {
  const colors = useThemeColors(useHostColorScheme());
  const refreshing = useRef(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const handleRefresh = async () => {
    if (!onRefresh || refreshing.current) return;
    refreshing.current = true;
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      refreshing.current = false;
      setIsRefreshing(false);
    }
  };
  const content = (
    <LazyColumn
      modifiers={[background(colors.background), ...(testID ? [nativeTestID(testID)] : [])]}
    >
      {children}
    </LazyColumn>
  );
  return onRefresh ? (
    <PullToRefreshBox
      isRefreshing={isRefreshing}
      onRefresh={handleRefresh}
      contentAlignment="topCenter"
      indicator={{ color: colors.controlActive, containerColor: colors.controlSurface }}
    >
      {content}
    </PullToRefreshBox>
  ) : (
    content
  );
}
