import type { ListItemProps } from '@expo/ui';
import { testID as nativeTestID } from '@expo/ui/jetpack-compose/modifiers';
import type { ListItemColors } from './list-item-appearance';

export function listItemAppearance(
  { colors: overrides, testID, modifiers, ...props }: ListItemProps,
  colors: ListItemColors,
): ListItemProps {
  return {
    ...props,
    testID,
    colors: {
      containerColor: colors.controlSurface,
      contentColor: colors.text,
      leadingContentColor: colors.controlActive,
      trailingContentColor: colors.muted,
      supportingContentColor: colors.muted,
      overlineContentColor: colors.muted,
      ...overrides,
    },
    modifiers: [...(modifiers ?? []), ...(testID ? [nativeTestID(testID)] : [])],
  };
}
