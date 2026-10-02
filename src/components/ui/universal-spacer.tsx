import { Spacer, type SpacerProps } from '@expo/ui';

/** Place inside a Row or Column hosted by @expo/ui. */
export function UniversalSpacer(props: SpacerProps) {
  return <Spacer {...props} />;
}
