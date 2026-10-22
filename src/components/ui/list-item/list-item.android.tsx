import { ListItem as NativeListItem, type ListItemProps } from '@expo/ui';
import { testID as nativeTestID } from '@expo/ui/jetpack-compose/modifiers';

/** The installed universal Android row does not forward testID. */
export function ListItem({ testID, modifiers, ...props }: ListItemProps) {
  return (
    <NativeListItem
      {...props}
      testID={testID}
      modifiers={[...(modifiers ?? []), ...(testID ? [nativeTestID(testID)] : [])]}
    />
  );
}

ListItem.Leading = NativeListItem.Leading;
ListItem.Supporting = NativeListItem.Supporting;
ListItem.Trailing = NativeListItem.Trailing;

export type { ListItemProps } from '@expo/ui';
