import { Icon } from '@expo/ui';
import { IconButton } from '@expo/ui/jetpack-compose';
import { semantics, size, testID as nativeTestID } from '@expo/ui/jetpack-compose/modifiers';
import type { AuthIconButtonProps } from './auth-icon-button.types';

export function AuthIconButton({
  icon,
  color,
  accessibilityLabel,
  testID,
  disabled = false,
  onPress,
}: AuthIconButtonProps) {
  return (
    <IconButton
      enabled={!disabled}
      onClick={disabled ? undefined : onPress}
      modifiers={[
        size(48, 48),
        semantics({ contentDescription: accessibilityLabel }),
        nativeTestID(testID),
      ]}
    >
      <Icon name={icon} size={24} color={color} />
    </IconButton>
  );
}
