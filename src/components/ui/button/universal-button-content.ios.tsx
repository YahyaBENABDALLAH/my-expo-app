import { Button, Text, VStack } from '@expo/ui/swift-ui';
import {
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
  const { accent, content } = buttonAppearance(
    variant,
    scheme,
    useHostButtonPalette(palette, scheme),
  );
  const filledStyle = variant === 'secondary' ? 'bordered' : 'borderedProminent';
  const nativeStyle = variant === 'link' ? 'plain' : filledStyle;
  return (
    <Button
      testID={testID}
      onPress={disabled ? undefined : onPress}
      modifiers={[
        buttonStyle(nativeStyle),
        tint(accent),
        nativeDisabled(Boolean(disabled)),
        clipShape('roundedRectangle', borderRadius),
      ]}
    >
      <VStack
        modifiers={[
          ...(fullWidth ? [frame({ maxWidth: Infinity })] : []),
          foregroundStyle(content),
          padding({ all: contentPadding }),
        ]}
      >
        {children ?? <Text>{label ?? ''}</Text>}
      </VStack>
    </Button>
  );
}
