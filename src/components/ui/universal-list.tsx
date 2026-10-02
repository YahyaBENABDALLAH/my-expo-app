import { List, type ListProps } from '@expo/ui';
import { UniversalHost } from './universal-host';
import type { UniversalThemeProps } from './types';

export type UniversalListProps = ListProps & UniversalThemeProps & { viewportHeight?: number };

export function UniversalList({
  colorScheme,
  seedColor,
  viewportHeight = 400,
  ...props
}: UniversalListProps) {
  return (
    <UniversalHost
      testID={props.testID ? `${props.testID}-container` : undefined}
      viewportHeight={viewportHeight}
      colorScheme={colorScheme}
      seedColor={seedColor}
    >
      <List {...props} />
    </UniversalHost>
  );
}
