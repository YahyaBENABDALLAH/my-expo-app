import { Switch, type SwitchProps } from '@expo/ui';
import { UniversalHost } from './universal-host';
import type { UniversalThemeProps } from './types';

export type UniversalSwitchProps = SwitchProps & UniversalThemeProps;

export function UniversalSwitch({ colorScheme, seedColor, ...props }: UniversalSwitchProps) {
  return (
    <UniversalHost
      testID={props.testID ? `${props.testID}-container` : undefined}
      colorScheme={colorScheme}
      seedColor={seedColor}
    >
      <Switch {...props} />
    </UniversalHost>
  );
}
