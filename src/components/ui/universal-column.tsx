import { Column, type ColumnProps } from '@expo/ui';
import { UniversalHost } from './universal-host';
import type { UniversalThemeProps } from './types';

export type UniversalColumnProps = ColumnProps & UniversalThemeProps;

export function UniversalColumn({ colorScheme, seedColor, ...props }: UniversalColumnProps) {
  return (
    <UniversalHost
      testID={props.testID ? `${props.testID}-container` : undefined}
      colorScheme={colorScheme}
      seedColor={seedColor}
    >
      <Column {...props} />
    </UniversalHost>
  );
}
