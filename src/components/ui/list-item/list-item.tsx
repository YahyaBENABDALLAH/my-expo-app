import { useThemeColors } from '@/hooks/use-theme';
import { ListItem as NativeListItem, type ListItemProps } from '@expo/ui';
import { useHostColorScheme } from '../host/universal-host';
import { listItemAppearance } from './list-item-appearance';

/** Shared row composition; native appearance preserves each platform's styling. */
export function ListItem(props: ListItemProps) {
  const colors = useThemeColors(useHostColorScheme());
  return <NativeListItem {...listItemAppearance(props, colors)} />;
}
ListItem.Leading = NativeListItem.Leading;
ListItem.Supporting = NativeListItem.Supporting;
ListItem.Trailing = NativeListItem.Trailing;

export type { ListItemProps } from '@expo/ui';
