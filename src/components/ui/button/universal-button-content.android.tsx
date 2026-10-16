import { Button, OutlinedButton, Shape, Text, TextButton } from '@expo/ui/jetpack-compose';
import { fillMaxWidth, testID as nativeTestID } from '@expo/ui/jetpack-compose/modifiers';
import type { UniversalButtonContentProps } from './universal-button.types';
import { useWireframeButtonColors } from './use-wireframe-button-colors';

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
  color: colorOverride,
  contentColor: contentColorOverride,
}: UniversalButtonContentProps) {
  const { color, contentColor } = useWireframeButtonColors({
    variant,
    color: colorOverride,
    contentColor: contentColorOverride,
  });
  let NativeButton = Button;
  if (variant === 'secondary' || variant === 'glass') NativeButton = OutlinedButton;
  if (variant === 'link') NativeButton = TextButton;
  const filled = variant !== 'secondary' && variant !== 'link' && variant !== 'glass';
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
      colors={
        color === undefined && contentColor === undefined
          ? undefined
          : {
              containerColor: filled ? color : undefined,
              contentColor: contentColor ?? (filled ? undefined : color),
            }
      }
      modifiers={[
        ...(fullWidth ? [fillMaxWidth()] : []),
        ...(testID ? [nativeTestID(testID)] : []),
      ]}
    >
      {children ?? <Text>{label ?? ''}</Text>}
    </NativeButton>
  );
}
