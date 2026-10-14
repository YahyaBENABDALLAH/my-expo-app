import {
  BottomSheet as NativeBottomSheet,
  type BottomSheetProps as NativeBottomSheetProps,
} from '@expo/ui';
import { Platform } from 'react-native';

export type BottomSheetProps = Pick<
  NativeBottomSheetProps,
  'children' | 'isPresented' | 'onDismiss' | 'testID'
>;

export function BottomSheet({ children, isPresented, onDismiss, testID }: BottomSheetProps) {
  return (
    <NativeBottomSheet
      isPresented={isPresented}
      onDismiss={onDismiss}
      testID={testID}
      showDragIndicator={Platform.OS === 'ios' ? false : undefined}
    >
      {children}
    </NativeBottomSheet>
  );
}
