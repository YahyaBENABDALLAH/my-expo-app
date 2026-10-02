import { FieldGroup, type FieldGroupProps } from '@expo/ui';
import { UniversalHost } from './universal-host';
import type { UniversalThemeProps } from './types';

export type UniversalFieldGroupProps = FieldGroupProps &
  UniversalThemeProps & { viewportHeight?: number };

/** Form/LazyColumn needs a bounded viewport instead of content-size measurement. */
export function UniversalFieldGroup({
  colorScheme,
  seedColor,
  viewportHeight = 440,
  ...props
}: UniversalFieldGroupProps) {
  return (
    <UniversalHost
      testID={props.testID ? `${props.testID}-container` : undefined}
      viewportHeight={viewportHeight}
      colorScheme={colorScheme}
      seedColor={seedColor}
    >
      <FieldGroup {...props} />
    </UniversalHost>
  );
}
