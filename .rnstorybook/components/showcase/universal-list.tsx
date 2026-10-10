import { List, type ListProps, UniversalHost, type UniversalThemeProps } from '@components/ui';

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
