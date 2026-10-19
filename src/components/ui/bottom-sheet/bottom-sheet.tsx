import {
  Column,
  RNHostView,
  BottomSheet as NativeBottomSheet,
  type BottomSheetProps as NativeBottomSheetProps,
} from '@expo/ui';
import { onSizeChanged } from '@expo/ui/jetpack-compose/modifiers';
import { onGeometryChange } from '@expo/ui/swift-ui/modifiers';
import { Platform } from 'react-native';
import { useMeasuredWidth } from '@/hooks/use-measured-width';
import { useThemeColors } from '@/hooks/use-theme';
import { UniversalHost, useHostColorScheme } from '../host/universal-host';
import { nativeFillWidth } from '../native/native-fill-width';

export type BottomSheetProps = Pick<
  NativeBottomSheetProps,
  'children' | 'isPresented' | 'onDismiss' | 'testID'
> & {
  contentHeight?: number;
};

export function BottomSheet({
  children,
  isPresented,
  onDismiss,
  testID,
  contentHeight,
}: BottomSheetProps) {
  const scheme = useHostColorScheme();
  const colors = useThemeColors(scheme);
  const [width, setWidth] = useMeasuredWidth();
  const measureWidth = ({ width }: { width: number }) => {
    if (width > 0) setWidth(width);
  };
  const sizing =
    Platform.OS === 'ios' ? onGeometryChange(measureWidth) : onSizeChanged(measureWidth);
  return (
    <NativeBottomSheet
      isPresented={isPresented}
      onDismiss={onDismiss}
      testID={testID}
      containerColor={colors.surface}
      contentColor={colors.text}
      showDragIndicator={Platform.OS === 'ios' ? false : undefined}
    >
      <Column modifiers={[...nativeFillWidth, sizing]} style={{ height: contentHeight }}>
        {/* Expo's sheet owns a Host that defaults to device direction. */}
        {width > 0 && (
          <RNHostView matchContents>
            <UniversalHost colorScheme={scheme} ignoreSafeArea="all" style={{ width }}>
              <Column modifiers={nativeFillWidth}>{children}</Column>
            </UniversalHost>
          </RNHostView>
        )}
      </Column>
    </NativeBottomSheet>
  );
}
