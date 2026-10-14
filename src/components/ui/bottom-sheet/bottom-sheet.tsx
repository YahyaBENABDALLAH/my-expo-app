import { useMeasuredWidth } from '@/hooks/use-measured-width';
import { useThemeColors } from '@/hooks/use-theme';
import {
  Column,
  BottomSheet as NativeBottomSheet,
  RNHostView,
  type BottomSheetProps as NativeBottomSheetProps,
} from '@expo/ui';
import { onSizeChanged } from '@expo/ui/jetpack-compose/modifiers';
import { frame, onGeometryChange, presentationCornerRadius } from '@expo/ui/swift-ui/modifiers';
import { createContext, useContext } from 'react';
import { Platform } from 'react-native';
import { UniversalHost, useHostColorScheme } from '../host/universal-host';
import { nativeFillWidth, nativeFillWidthCenter } from '../native/native-fill-width';

// Modifier factories return configs; each platform applies its own sizing configs.
const isIOS = Platform.OS === 'ios';
const presentationModifiers = isIOS ? [presentationCornerRadius(28)] : [];
const BottomSheetContentWidthContext = createContext(0);

/** Reuse the native width for specialized content such as OTP digit slots. */
export function useBottomSheetContentWidth() {
  return useContext(BottomSheetContentWidthContext);
}

export type BottomSheetProps = NativeBottomSheetProps;

/** Expo sheets own a native Host, so their content needs an explicit theme/direction bridge. */
export function BottomSheet({
  children,
  containerColor,
  contentColor,
  contentPadding = 24,
  modifiers,
  showDragIndicator = true,
  ...props
}: BottomSheetProps) {
  const scheme = useHostColorScheme();
  const colors = useThemeColors(scheme);
  const [width, setWidth] = useMeasuredWidth();

  const measureWidth = ({ width: nextWidth }: { width: number }) => {
    if (nextWidth > 0) setWidth(nextWidth);
  };
  const sizing = isIOS
    ? [frame({ maxWidth: Infinity, alignment: 'topLeading' }), onGeometryChange(measureWidth)]
    : [...nativeFillWidth, onSizeChanged(measureWidth)];
  return (
    <NativeBottomSheet
      {...props}
      containerColor={containerColor ?? colors.surface}
      contentColor={contentColor ?? colors.text}
      contentPadding={contentPadding}
      modifiers={[...presentationModifiers, ...(modifiers ?? [])]}
      showDragIndicator={isIOS ? false : showDragIndicator}
    >
      <Column alignment="start" modifiers={sizing}>
        {isIOS && showDragIndicator && (
          <Column alignment="center" modifiers={nativeFillWidthCenter}>
            <Column
              style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: colors.muted }}
            />
          </Column>
        )}
        <RNHostView matchContents>
          <UniversalHost ignoreSafeArea="all" style={{ width }}>
            <BottomSheetContentWidthContext.Provider value={width}>
              <Column alignment="start" modifiers={nativeFillWidth}>
                {children}
              </Column>
            </BottomSheetContentWidthContext.Provider>
          </UniversalHost>
        </RNHostView>
      </Column>
    </NativeBottomSheet>
  );
}
