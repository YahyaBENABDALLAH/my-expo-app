import { Switch, type SwitchProps, UniversalHost, type UniversalThemeProps } from '@components/ui';

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
