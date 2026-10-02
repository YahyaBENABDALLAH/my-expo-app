import { BottomSheet, type BottomSheetProps } from '@expo/ui';
import Colors from '@/constants/colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { UniversalHost } from './universal-host';
import type { UniversalThemeProps } from './types';

export type UniversalBottomSheetProps = BottomSheetProps & UniversalThemeProps;

export function UniversalBottomSheet({
  colorScheme,
  seedColor,
  containerColor,
  ...props
}: UniversalBottomSheetProps) {
  const scheme = useColorScheme(colorScheme);
  return (
    <UniversalHost
      testID={props.testID ? `${props.testID}-container` : undefined}
      colorScheme={scheme}
      seedColor={seedColor}
    >
      <BottomSheet {...props} containerColor={containerColor ?? Colors[scheme].surface} />
    </UniversalHost>
  );
}
