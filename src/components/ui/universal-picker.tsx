import { Picker, type PickerProps, type PickerItemValue } from '@expo/ui';
import { UniversalHost } from './universal-host';
import type { UniversalThemeProps } from './types';

export type UniversalPickerProps = Omit<PickerProps, 'children'> &
  UniversalThemeProps & {
    options: { label: string; value: PickerItemValue }[];
  };

export function UniversalPicker({
  colorScheme,
  seedColor,
  options,
  ...props
}: UniversalPickerProps) {
  return (
    <UniversalHost
      testID={props.testID ? `${props.testID}-container` : undefined}
      colorScheme={colorScheme}
      seedColor={seedColor}
    >
      <Picker {...props}>
        {options.map((item) => (
          <Picker.Item key={`${typeof item.value}:${item.value}`} {...item} />
        ))}
      </Picker>
    </UniversalHost>
  );
}
