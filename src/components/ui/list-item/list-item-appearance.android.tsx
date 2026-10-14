import type { ListItemProps } from '@expo/ui';
import { testID as nativeTestID } from '@expo/ui/jetpack-compose/modifiers';

/** The installed universal Android row does not forward testID. */
export function listItemAppearance({ testID, modifiers, ...props }: ListItemProps): ListItemProps {
  return {
    ...props,
    testID,
    modifiers: [...(modifiers ?? []), ...(testID ? [nativeTestID(testID)] : [])],
  };
}
