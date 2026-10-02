import { ScrollView, type ScrollViewProps } from '@expo/ui';
import { UniversalHost } from './universal-host';
import type { UniversalThemeProps } from './types';

export type UniversalScrollViewProps = ScrollViewProps &
  UniversalThemeProps & { viewportHeight?: number };

export function UniversalScrollView({
  colorScheme,
  seedColor,
  viewportHeight = 320,
  ...props
}: UniversalScrollViewProps) {
  return (
    <UniversalHost
      testID={props.testID ? `${props.testID}-container` : undefined}
      viewportHeight={viewportHeight}
      colorScheme={colorScheme}
      seedColor={seedColor}
    >
      <ScrollView {...props} />
    </UniversalHost>
  );
}
