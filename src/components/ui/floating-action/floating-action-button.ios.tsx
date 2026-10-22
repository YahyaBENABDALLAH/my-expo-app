import { Button, HStack } from '@expo/ui/swift-ui';
import {
  accessibilityLabel,
  background,
  buttonStyle,
  contentShape,
  disabled as nativeDisabled,
  fixedSize,
  frame,
  shapes,
} from '@expo/ui/swift-ui/modifiers';
import type { NativeFloatingActionButtonProps } from './floating-action-button';

export function NativeFloatingActionButton({
  children,
  color,
  label,
  onPress,
  disabled,
}: NativeFloatingActionButtonProps) {
  return (
    <Button
      testID="tab-context-action"
      onPress={disabled ? undefined : onPress}
      modifiers={[
        buttonStyle('plain'),
        nativeDisabled(Boolean(disabled)),
        fixedSize({ horizontal: true, vertical: true }),
        accessibilityLabel(label),
      ]}
    >
      <HStack
        modifiers={[
          frame({ width: 76, height: 76 }),
          background(color, shapes.circle()),
          contentShape(shapes.circle()),
        ]}
      >
        {children}
      </HStack>
    </Button>
  );
}
