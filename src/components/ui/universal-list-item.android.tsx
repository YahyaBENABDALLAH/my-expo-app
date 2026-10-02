import { ListItem, type ListItemProps } from '@expo/ui';
import { testID as testIDModifier } from '@expo/ui/jetpack-compose/modifiers';

/** SDK 57's universal Android ListItem currently drops its testID prop. */
export function UniversalListItem({ testID, modifiers, ...props }: ListItemProps) {
  return (
    <ListItem
      {...props}
      modifiers={[...(modifiers ?? []), ...(testID ? [testIDModifier(testID)] : [])]}
    />
  );
}
