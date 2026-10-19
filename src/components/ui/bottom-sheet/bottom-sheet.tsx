import {
  Column,
  BottomSheet as NativeBottomSheet,
  type BottomSheetProps as NativeBottomSheetProps,
} from '@expo/ui';
import { Platform } from 'react-native';
import { useThemeColors } from '@/hooks/use-theme';
import { useHostColorScheme } from '../host/universal-host';
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
  const colors = useThemeColors(useHostColorScheme());
  return (
    <NativeBottomSheet
      isPresented={isPresented}
      onDismiss={onDismiss}
      testID={testID}
      containerColor={colors.surface}
      contentColor={colors.text}
      showDragIndicator={Platform.OS === 'ios' ? false : undefined}
    >
      {contentHeight === undefined ? (
        children
      ) : (
        <Column modifiers={nativeFillWidth} style={{ height: contentHeight }}>
          {children}
        </Column>
      )}
    </NativeBottomSheet>
  );
}
