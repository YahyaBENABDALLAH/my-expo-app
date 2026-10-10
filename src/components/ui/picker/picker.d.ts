import type { PickerItemValue, PickerProps } from '@expo/ui';
export declare function Picker<T extends PickerItemValue>(
  props: PickerProps<T>,
): import('react').ReactElement;
export declare namespace Picker {
  const Item: typeof import('@expo/ui').Picker.Item;
}
export type { PickerProps, PickerItemProps, PickerItemValue } from '@expo/ui';
