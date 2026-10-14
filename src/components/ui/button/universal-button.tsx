import { Host } from '@expo/ui';
import { UniversalButtonContent } from './universal-button-content';
import type { UniversalButtonProps } from './universal-button.types';

export type {
  UniversalButtonContentProps,
  UniversalButtonProps,
  UniversalButtonVariant,
} from './universal-button.types';

/** Standalone control. Inside an existing Host, use UniversalButtonContent. */
export function UniversalButton({ colorScheme, ...props }: UniversalButtonProps) {
  return (
    <Host
      testID={props.testID ? `${props.testID}-container` : undefined}
      matchContents={props.fullWidth ? { vertical: true } : true}
      style={props.fullWidth ? { width: '100%' } : undefined}
      colorScheme={colorScheme}
    >
      <UniversalButtonContent {...props} />
    </Host>
  );
}
