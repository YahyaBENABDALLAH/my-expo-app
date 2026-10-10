import { UniversalButtonContent } from './universal-button-content';
import { UniversalHost } from './universal-host';
import type { UniversalButtonProps } from './universal-button.types';

export type { UniversalButtonProps, UniversalButtonVariant } from './universal-button.types';

/** Standalone control. Inside an existing Host, use UniversalButtonContent. */
export function UniversalButton(props: UniversalButtonProps) {
  return (
    <UniversalHost
      testID={props.testID ? `${props.testID}-container` : undefined}
      inline={!props.fullWidth}
      colorScheme={props.colorScheme}
    >
      <UniversalButtonContent {...props} />
    </UniversalHost>
  );
}
