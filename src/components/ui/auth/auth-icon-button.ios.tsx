import { Icon } from '@expo/ui';
import { Button } from '@expo/ui/swift-ui';
import {
  accessibilityLabel,
  buttonStyle,
  contentShape,
  disabled as nativeDisabled,
  frame,
  shapes,
} from '@expo/ui/swift-ui/modifiers';
import type { AuthIconButtonProps } from './auth-icon-button.types';

export function AuthIconButton({
  icon,
  color,
  accessibilityLabel: label,
  testID,
  disabled = false,
  onPress,
}: AuthIconButtonProps) {
  return (
    <Button
      testID={testID}
      onPress={disabled ? undefined : onPress}
      modifiers={[buttonStyle('plain'), accessibilityLabel(label), nativeDisabled(disabled)]}
    >
      <Icon
        name={icon}
        size={24}
        color={color}
        modifiers={[frame({ width: 48, height: 48 }), contentShape(shapes.rectangle())]}
      />
    </Button>
  );
}
