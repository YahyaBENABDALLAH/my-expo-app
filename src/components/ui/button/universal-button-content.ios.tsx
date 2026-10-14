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
import type { UniversalButtonContentProps } from './universal-button.types';

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
  color,
  contentColor,
}: UniversalButtonContentProps) {
  let style: 'plain' | 'bordered' | 'borderedProminent' = 'borderedProminent';
  if (variant === 'secondary') style = 'bordered';
  if (variant === 'link') style = 'plain';
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
