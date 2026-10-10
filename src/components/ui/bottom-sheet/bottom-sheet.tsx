import { useThemeColors } from '@/hooks/use-theme';
import { BottomSheet as NativeBottomSheet, RNHostView, type BottomSheetProps } from '@expo/ui';
import { UniversalHost, useHostColorScheme } from '../host/universal-host';

/** Expo sheets own a native Host, so their content needs an explicit theme/direction bridge. */
export function BottomSheet({
  children,
  containerColor,
  contentColor,
  ...props
}: BottomSheetProps) {
  const scheme = useHostColorScheme();
  const colors = useThemeColors(scheme);
  return (
    <NativeBottomSheet
      {...props}
      containerColor={containerColor ?? colors.surface}
      contentColor={contentColor ?? colors.text}
    >
      <RNHostView matchContents>
        <UniversalHost ignoreSafeArea="all">{children}</UniversalHost>
      </RNHostView>
    </NativeBottomSheet>
  );
}

export type { BottomSheetProps } from '@expo/ui';
