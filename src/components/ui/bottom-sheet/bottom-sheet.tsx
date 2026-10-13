import { useThemeColors } from '@/hooks/use-theme';
import {
  BottomSheet as NativeBottomSheet,
  Column,
  RNHostView,
  type BottomSheetProps as NativeBottomSheetProps,
} from '@expo/ui';
import { frame, onGeometryChange } from '@expo/ui/swift-ui/modifiers';
import { onSizeChanged } from '@expo/ui/jetpack-compose/modifiers';
import { useMeasuredWidth } from '@/hooks/use-measured-width';
import { createContext, useContext } from 'react';
import { Platform, useWindowDimensions } from 'react-native';
import { UniversalHost, useHostColorScheme } from '../host/universal-host';
import { nativeFillWidth } from '../native/native-fill-width';

// Modifier factories return configs; each platform applies its own sizing configs.
const isIOS = Platform.OS === 'ios';
const BottomSheetContentWidthContext = createContext(0);

/** Reuse the sheet's padded width instead of measuring another native/JS boundary. */
export function useBottomSheetContentWidth() {
  return useContext(BottomSheetContentWidthContext);
}

export type BottomSheetProps = NativeBottomSheetProps & {
  /** Available content width for the first frame, before native sheet measurement. */
  initialContentWidth?: number;
};

/** Expo sheets own a native Host, so their content needs an explicit theme/direction bridge. */
export function BottomSheet({
  children,
  containerColor,
  contentColor,
  contentPadding = 24,
  snapPoints,
  initialContentWidth,
  ...props
}: BottomSheetProps) {
  const scheme = useHostColorScheme();
  const colors = useThemeColors(scheme);
  const { width: windowWidth } = useWindowDimensions();
  const [width, setWidth] = useMeasuredWidth();
  const horizontalPadding =
    typeof contentPadding === 'number'
      ? contentPadding * 2
      : (contentPadding.left ?? 0) + (contentPadding.right ?? 0);
  // A zero-width Host wraps text and changes the sheet's height while it is opening.
  const firstWidth =
    initialContentWidth !== undefined &&
    Number.isFinite(initialContentWidth) &&
    initialContentWidth > 0
      ? initialContentWidth
      : Math.max(1, windowWidth - horizontalPadding);
  const measureWidth = ({ width: nextWidth }: { width: number }) => {
    if (Number.isFinite(nextWidth) && nextWidth > 0) setWidth(nextWidth);
  };
  const sizing = isIOS
    ? [
        frame({
          maxWidth: Infinity,
          ...(snapPoints?.length ? { maxHeight: Infinity } : {}),
          alignment: 'topLeading',
        }),
        onGeometryChange(measureWidth),
      ]
    : [...nativeFillWidth, onSizeChanged(measureWidth)];
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
          <UniversalHost ignoreSafeArea="all" style={{ width: width || firstWidth }}>
            <BottomSheetContentWidthContext.Provider value={width || firstWidth}>
              <Column alignment="start" spacing={16} modifiers={nativeFillWidth}>
                {children}
              </Column>
            </BottomSheetContentWidthContext.Provider>
          </UniversalHost>
        </RNHostView>
      </Column>
    </NativeBottomSheet>
  );
}
