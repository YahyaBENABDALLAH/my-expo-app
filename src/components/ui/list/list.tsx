import { List as NativeList, type ListProps } from '@expo/ui';
import { usePendingRefresh } from '../refreshable-scroll-view/use-pending-refresh';

export function List({ onRefresh, ...props }: ListProps) {
  const refresh = usePendingRefresh(onRefresh);
  return <NativeList {...props} onRefresh={onRefresh ? refresh : undefined} />;
}

export type { ListProps } from '@expo/ui';
