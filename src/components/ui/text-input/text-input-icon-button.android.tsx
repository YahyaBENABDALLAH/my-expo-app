import { IconButton } from '@expo/ui/jetpack-compose';
import { size, testID } from '@expo/ui/jetpack-compose/modifiers';
import type { TextInputIconButtonProps } from './text-input-icon-button.types';
import { rightIconLabel } from './text-input-modifiers';

export function TextInputIconButton({
  children,
  disabled,
  onPress,
  accessibilityLabel,
  testID: id,
}: TextInputIconButtonProps) {
  return (
    <IconButton
      enabled={!disabled}
      onClick={disabled ? undefined : onPress}
      modifiers={[
        size(48, 48),
        ...(id ? [testID(id)] : []),
        ...(accessibilityLabel ? rightIconLabel(accessibilityLabel) : []),
      ]}
    >
      {children}
    </IconButton>
  );
}
