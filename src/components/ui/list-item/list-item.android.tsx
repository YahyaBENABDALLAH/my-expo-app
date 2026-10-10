import { useThemeColors } from '@/hooks/use-theme';
import { ListItem as NativeListItem, type ListItemProps } from '@expo/ui';
import { testID as nativeTestID } from '@expo/ui/jetpack-compose/modifiers';
import { useHostColorScheme } from '../host/universal-host';

export function ListItem({ colors: overrides, testID, modifiers, ...props }: ListItemProps) {
  const colors = useThemeColors(useHostColorScheme());
  return (
    <NativeListItem
      {...props}
      testID={testID}
      colors={{
        containerColor: colors.controlSurface,
        contentColor: colors.text,
        leadingContentColor: colors.controlActive,
        trailingContentColor: colors.muted,
        supportingContentColor: colors.muted,
        overlineContentColor: colors.muted,
        ...overrides,
      }}
      modifiers={[...(modifiers ?? []), ...(testID ? [nativeTestID(testID)] : [])]}
    />
  );
}
ListItem.Leading = NativeListItem.Leading;
ListItem.Supporting = NativeListItem.Supporting;
ListItem.Trailing = NativeListItem.Trailing;
