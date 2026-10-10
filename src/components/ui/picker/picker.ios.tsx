import { useThemeColors } from '@/hooks/use-theme';
import { Picker as UniversalPicker, type PickerItemValue, type PickerProps } from '@expo/ui';
import { Picker as NativePicker, Text } from '@expo/ui/swift-ui';
import { disabled, foregroundStyle, pickerStyle, tag, tint } from '@expo/ui/swift-ui/modifiers';
import { useHostColorScheme } from '../host/universal-host';
import { pickerItems } from './picker-items';

export function Picker<T extends PickerItemValue>({
  selectedValue,
  onValueChange,
  appearance = 'menu',
  enabled = true,
  children,
  testID,
}: PickerProps<T>) {
  const colors = useThemeColors(useHostColorScheme());
  return (
    <NativePicker
      selection={selectedValue}
      testID={testID}
      onSelectionChange={(value) => {
        if (enabled && value != null) onValueChange(value as T);
      }}
      modifiers={[
        pickerStyle(appearance),
        disabled(!enabled),
        tint(colors.controlActive),
        foregroundStyle(enabled ? colors.text : colors.controlDisabledContent),
      ]}
    >
      {pickerItems<T>(children).map((item) => (
        <Text key={`${typeof item.value}:${item.value}`} modifiers={[tag(item.value)]}>
          {item.label}
        </Text>
      ))}
    </NativePicker>
  );
}
Picker.Item = UniversalPicker.Item;
