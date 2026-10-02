import { Checkbox, type CheckboxProps } from '@expo/ui';
import { UniversalHost } from './universal-host';
import type { UniversalThemeProps } from './types';

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
