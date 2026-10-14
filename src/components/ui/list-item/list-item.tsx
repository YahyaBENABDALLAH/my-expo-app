import { ListItem as NativeListItem, type ListItemProps } from '@expo/ui';
import { listItemAppearance } from './list-item-appearance';

/** Shared row composition; native appearance preserves each platform's styling. */
export function ListItem(props: ListItemProps) {
  return <NativeListItem {...listItemAppearance(props)} />;
}
ListItem.Leading = NativeListItem.Leading;
ListItem.Supporting = NativeListItem.Supporting;
ListItem.Trailing = NativeListItem.Trailing;

export type { ListItemProps } from '@expo/ui';
