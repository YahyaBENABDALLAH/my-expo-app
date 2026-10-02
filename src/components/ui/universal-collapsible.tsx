import { Collapsible, type CollapsibleProps } from '@expo/ui';
import { UniversalHost } from './universal-host';
import type { UniversalThemeProps } from './types';

export type UniversalCollapsibleProps = CollapsibleProps & UniversalThemeProps;

export function UniversalCollapsible({
  colorScheme,
  seedColor,
  testID,
  ...props
}: UniversalCollapsibleProps) {
  return (
    <UniversalHost testID={testID} colorScheme={colorScheme} seedColor={seedColor}>
      <Collapsible {...props} />
    </UniversalHost>
  );
}
