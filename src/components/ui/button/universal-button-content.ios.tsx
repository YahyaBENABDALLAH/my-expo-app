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
import { useHostButtonPalette, useHostColorScheme } from '../host/universal-host';
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
  const unfilledStyle = variant === 'link' ? 'plain' : 'bordered';
  return (
    <Button
      testID={testID}
      onPress={disabled ? undefined : onPress}
      modifiers={[
        buttonStyle(filled ? 'borderedProminent' : unfilledStyle),

        tint(accent),
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
          foregroundStyle(content),
          ...(contentPadding === undefined ? [] : [padding({ all: contentPadding })]),
        ]}
      >
        {children ?? <Text>{label ?? ''}</Text>}
      </VStack>
    </Button>
  );
}
