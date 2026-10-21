import { Button, OutlinedButton, Shape, Text, TextButton } from '@expo/ui/jetpack-compose';
import { fillMaxWidth, testID as nativeTestID } from '@expo/ui/jetpack-compose/modifiers';
import type { UniversalButtonContentProps } from './universal-button.types';
import { useWireframeButtonColors } from './use-wireframe-button-colors';

export function UniversalButtonContent(props: UniversalButtonContentProps) {
  const colors = useWireframeButtonColors(props);
  return <NativeButtonContent {...props} {...colors} />;
}

/** Internal renderer; callers resolve theme colors before reaching the native control. */
export function NativeButtonContent({
  variant,
  label,
  children,
  onPress,
  disabled,
  testID,
  fullWidth,
  borderRadius,
  contentPadding,
  color,
  contentColor,
}: UniversalButtonContentProps) {
  let NativeButton = Button;
  if (variant === 'secondary' || variant === 'glass') NativeButton = OutlinedButton;
  if (variant === 'tertiary' || variant === 'link') NativeButton = TextButton;
  const filled = NativeButton === Button;
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
