import { Picker as NativePicker, type PickerItemProps, type PickerItemValue } from '@expo/ui';
import { isValidElement, type ReactNode } from 'react';
import { flattenNativeChildren } from '../native/native-children';

export function pickerItems<T extends PickerItemValue>(children: ReactNode): PickerItemProps<T>[] {
  return flattenNativeChildren(children).flatMap((child) =>
    isValidElement<PickerItemProps<T>>(child) && child.type === NativePicker.Item
      ? [child.props]
      : [],
  );
}
