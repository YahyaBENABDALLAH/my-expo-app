import type { RowProps } from '@expo/ui';
import { IconButton } from '@expo/ui/jetpack-compose';
import {
  defaultMinSize,
  fillMaxWidth,
  semantics,
  size,
  testID,
  weight,
} from '@expo/ui/jetpack-compose/modifiers';
import type { TextInputIconButtonProps } from './text-input-native';

export const inputRowFlex = [weight(1)];

export function inputFieldAppearance(
  style: NonNullable<RowProps['style']>,
): Pick<RowProps, 'style' | 'modifiers'> {
  return {
    style,
    modifiers: [
      ...(style.width === undefined ? [fillMaxWidth()] : []),
      ...(style.height === undefined ? [defaultMinSize({ minHeight: 48 })] : []),
    ],
  };
}

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
        ...(accessibilityLabel ? [semantics({ contentDescription: accessibilityLabel })] : []),
      ]}
    >
      {children}
    </IconButton>
  );
}
