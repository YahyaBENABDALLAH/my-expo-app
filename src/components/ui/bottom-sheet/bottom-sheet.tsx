import { useThemeColors } from '@/hooks/use-theme';
import {
  BottomSheet as NativeBottomSheet,
  Column,
  RNHostView,
  type BottomSheetProps,
} from '@expo/ui';
import { frame, onGeometryChange } from '@expo/ui/swift-ui/modifiers';
import { useMeasuredWidth } from '@/hooks/use-measured-width';
import { Platform } from 'react-native';
import { UniversalHost, useHostColorScheme } from '../host/universal-host';
import { nativeFillWidth } from '../native/native-fill-width';

// Modifier factories return configs; SwiftUI sizing configs are applied only on iOS.
const isIOS = Platform.OS === 'ios';

/** Expo sheets own a native Host, so their content needs an explicit theme/direction bridge. */
export function BottomSheet({
  children,
  containerColor,
  contentColor,
  contentPadding = 24,
  snapPoints,
  ...props
}: BottomSheetProps) {
  const scheme = useHostColorScheme();
  const colors = useThemeColors(scheme);
  const [width, setWidth] = useMeasuredWidth();
  const sizing = isIOS
    ? [
        frame({
          maxWidth: Infinity,
          ...(snapPoints?.length ? { maxHeight: Infinity } : {}),
          alignment: 'topLeading',
        }),
        onGeometryChange(({ width: nextWidth }) => {
          if (Number.isFinite(nextWidth) && nextWidth > 0) setWidth(nextWidth);
        }),
      ]
    : nativeFillWidth;
  return (
    <NativeBottomSheet
      {...props}
      containerColor={containerColor ?? colors.surface}
      contentColor={contentColor ?? colors.text}
      contentPadding={contentPadding}
      snapPoints={snapPoints}
    >
      <Column alignment="start" modifiers={sizing}>
        <RNHostView matchContents>
          <UniversalHost ignoreSafeArea="all" style={isIOS ? { width } : undefined}>
            <Column alignment="start" spacing={16} modifiers={nativeFillWidth}>
              {children}
            </Column>
          </UniversalHost>
        </RNHostView>
      </Column>
    </NativeBottomSheet>
  );
}

export type { BottomSheetProps } from '@expo/ui';
