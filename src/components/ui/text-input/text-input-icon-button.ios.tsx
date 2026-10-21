import { Button, HStack } from '@expo/ui/swift-ui';
import {
  buttonStyle,
  contentShape,
  disabled as nativeDisabled,
  fixedSize,
  frame,
  shapes,
} from '@expo/ui/swift-ui/modifiers';
import type { TextInputIconButtonProps } from './text-input-icon-button.types';
import { rightIconLabel } from './text-input-modifiers';

export function TextInputIconButton({
  children,
  disabled,
  onPress,
  accessibilityLabel,
  testID,
}: TextInputIconButtonProps) {
  return (
    <Button
      testID={testID}
      onPress={disabled ? undefined : onPress}
      modifiers={[
        buttonStyle('plain'),
        nativeDisabled(Boolean(disabled)),
        fixedSize({ horizontal: true, vertical: true }),
        ...(accessibilityLabel ? rightIconLabel(accessibilityLabel) : []),
      ]}
    >
      {/* Size the label itself so the flexible text field cannot compress the icon. */}
      <HStack modifiers={[frame({ width: 48, height: 48 }), contentShape(shapes.rectangle())]}>
        {children}
      </HStack>
    </Button>
  );
}
