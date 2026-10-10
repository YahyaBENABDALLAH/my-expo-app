import { useThemeColors } from '@/hooks/use-theme';
import type { ListProps } from '@expo/ui';
import { List as NativeList } from '@expo/ui/swift-ui';
import {
  background,
  foregroundStyle,
  refreshable,
  scrollContentBackground,
  tint,
} from '@expo/ui/swift-ui/modifiers';
import { useHostColorScheme } from '../host/universal-host';

export function List({ children, onRefresh, testID }: ListProps) {
  const colors = useThemeColors(useHostColorScheme());
  return (
    <NativeList
      testID={testID}
      modifiers={[
        scrollContentBackground('hidden'),
        background(colors.background),
        foregroundStyle(colors.text),
        tint(colors.controlActive),
        ...(onRefresh ? [refreshable(onRefresh)] : []),
      ]}
    >
      {children}
    </NativeList>
  );
}
