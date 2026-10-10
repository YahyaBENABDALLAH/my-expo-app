import {
  Picker,
  type PickerProps,
  type PickerItemValue,
  UniversalHost,
  type UniversalThemeProps,
} from '@components/ui';

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
