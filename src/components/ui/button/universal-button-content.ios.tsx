import { Button, Text, VStack } from '@expo/ui/swift-ui';
import {
  buttonBorderShape,
  buttonStyle,
  clipShape,
  foregroundStyle,
  frame,
  disabled as nativeDisabled,
  padding,
  tint,
} from '@expo/ui/swift-ui/modifiers';
import type { UniversalButtonContentProps } from './universal-button';

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
  let style: Parameters<typeof buttonStyle>[0] = 'borderedProminent';
  if (variant === 'secondary') style = 'bordered';
  if (variant === 'tertiary' || variant === 'link') style = 'plain';
  if (variant === 'glass') style = 'glass';
  const labelColor = contentColor ?? (style === 'borderedProminent' ? undefined : color);
  return (
    <Button
      testID={testID}
      role={variant === 'destructive' ? 'destructive' : undefined}
      onPress={disabled ? undefined : onPress}
      modifiers={[
        buttonStyle(style),
        ...(color === undefined ? [] : [tint(color)]),
        nativeDisabled(Boolean(disabled)),
        ...(borderRadius === undefined
          ? []
          : [
              buttonBorderShape('roundedRectangle', borderRadius),
              clipShape('roundedRectangle', borderRadius),
            ]),
      ]}
    >
      <VStack
        modifiers={[
          ...(fullWidth ? [frame({ maxWidth: Infinity })] : []),
          ...(labelColor === undefined ? [] : [foregroundStyle(labelColor)]),
          ...(contentPadding === undefined ? [] : [padding({ all: contentPadding })]),
        ]}
      >
        {children ?? <Text>{label ?? ''}</Text>}
      </VStack>
    </Button>
  );
}
