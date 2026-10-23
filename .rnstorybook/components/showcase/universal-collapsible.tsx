import {
  Collapsible,
  type CollapsibleProps,
  UniversalHost,
  type UniversalThemeProps,
} from '@components/ui';

export type UniversalCollapsibleProps = CollapsibleProps & UniversalThemeProps;

/** The Host ID identifies this fixture's layout, not its native disclosure header. */
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
