import { Button, VStack, Text } from '@expo/ui/swift-ui';
import {
  buttonStyle,
  clipShape,
  disabled as nativeDisabled,
  foregroundStyle,
  frame,
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
        ...(borderRadius === undefined ? [] : [clipShape('roundedRectangle', borderRadius)]),
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
