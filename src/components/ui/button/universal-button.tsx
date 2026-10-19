import { Host } from '@expo/ui';
import { NativeButtonContent } from './universal-button-content';
import type { UniversalButtonProps } from './universal-button.types';
import { useWireframeButtonColors } from './use-wireframe-button-colors';

export type {
  UniversalButtonContentProps,
  UniversalButtonProps,
  UniversalButtonVariant,
} from './universal-button.types';

/** Standalone control. Inside an existing Host, use UniversalButtonContent. */
export function UniversalButton({ colorScheme, cornerRadii, ...props }: UniversalButtonProps) {
  const colors = useWireframeButtonColors({ ...props, colorScheme });
  return (
    <Host
      testID={props.testID ? `${props.testID}-container` : undefined}
      matchContents={props.fullWidth ? { vertical: true } : true}
      style={[
        props.fullWidth ? { width: '100%' } : undefined,
        // SwiftUI's native button shape only supports a uniform radius. Clip the
        // existing RN boundary, without painting another surface or adding a Host.
        cornerRadii && {
          overflow: 'hidden',
          borderTopLeftRadius: cornerRadii.topLeft ?? 0,
          borderTopRightRadius: cornerRadii.topRight ?? 0,
          borderBottomLeftRadius: cornerRadii.bottomLeft ?? 0,
          borderBottomRightRadius: cornerRadii.bottomRight ?? 0,
        },
      ]}
      colorScheme={colorScheme}
    >
      <NativeButtonContent
        {...props}
        {...colors}
        borderRadius={cornerRadii ? 0 : props.borderRadius}
      />
    </Host>
  );
}
