import {
  Checkbox,
  type CheckboxProps,
  UniversalHost,
  type UniversalThemeProps,
} from '@components/ui';

export type UniversalCheckboxProps = CheckboxProps & UniversalThemeProps;

export function UniversalCheckbox({ colorScheme, seedColor, ...props }: UniversalCheckboxProps) {
  return (
    <UniversalHost
      testID={props.testID ? `${props.testID}-container` : undefined}
      colorScheme={colorScheme}
      seedColor={seedColor}
    >
      <Checkbox {...props} />
    </UniversalHost>
  );
}
