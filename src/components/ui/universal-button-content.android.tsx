import { Button, OutlinedButton, Shape, Text, TextButton } from '@expo/ui/jetpack-compose';
import { fillMaxWidth, testID as nativeTestID } from '@expo/ui/jetpack-compose/modifiers';
import { useHostButtonPalette, useHostColorScheme } from './universal-host';
import { buttonAppearance, type UniversalButtonProps } from './universal-button.types';

export function UniversalButtonContent({
  variant,
  label,
  children,
  onPress,
  disabled,
  testID,
  fullWidth,
  borderRadius,
  contentPadding,
  colorScheme,
  palette,
}: UniversalButtonProps) {
  const scheme = useHostColorScheme(colorScheme);
  const { filled, accent, content } = buttonAppearance(
    variant,
    scheme,
    useHostButtonPalette(palette, scheme),
  );
  const NativeButton =
    variant === 'secondary' ? OutlinedButton : variant === 'link' ? TextButton : Button;
  return (
    <NativeButton
      onClick={disabled ? undefined : onPress}
      enabled={!disabled}
      shape={
        borderRadius === undefined
          ? undefined
          : Shape.RoundedCorner({
              cornerRadii: {
                topStart: borderRadius,
                topEnd: borderRadius,
                bottomStart: borderRadius,
                bottomEnd: borderRadius,
              },
            })
      }
      contentPadding={
        contentPadding === undefined
          ? undefined
          : {
              start: contentPadding,
              end: contentPadding,
              top: contentPadding,
              bottom: contentPadding,
            }
      }
      colors={{ ...(filled ? { containerColor: accent } : {}), contentColor: content }}
      modifiers={[
        ...(fullWidth ? [fillMaxWidth()] : []),
        ...(testID ? [nativeTestID(testID)] : []),
      ]}
    >
      {children ?? <Text>{label ?? ''}</Text>}
    </NativeButton>
  );
}
