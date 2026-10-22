import type { RowProps } from '@expo/ui';
import { Button, HStack } from '@expo/ui/swift-ui';
import {
  accessibilityLabel as nativeAccessibilityLabel,
  background,
  buttonStyle,
  clipShape,
  contentShape,
  disabled as nativeDisabled,
  fixedSize,
  frame,
  shapes,
  strokeBorder,
  textFieldStyle,
} from '@expo/ui/swift-ui/modifiers';
import type { TextInputIconButtonProps } from './text-input-native';

// Both SecureField and TextField use the same unpadded native style.
export const inputRowFlex = [textFieldStyle('plain'), frame({ maxWidth: Infinity })];

export function inputFieldAppearance(
  style: NonNullable<RowProps['style']>,
): Pick<RowProps, 'style' | 'modifiers'> {
  const {
    width,
    height,
    backgroundColor,
    borderRadius,
    borderColor,
    borderWidth,
    ...contentStyle
  } = style;
  return {
    style: contentStyle,
    modifiers: [
      frame({
        width: width as number | undefined,
        height: height as number | undefined,
        maxWidth: width === undefined ? Infinity : undefined,
        minHeight: height === undefined ? 48 : undefined,
      }),
      ...(backgroundColor == null ? [] : [background(backgroundColor)]),
      ...(borderRadius == null
        ? []
        : [clipShape('roundedRectangle', typeof borderRadius === 'number' ? borderRadius : 0)]),
      // An inset stroke follows the same rounded shape as the surface.
      ...(borderColor != null && borderWidth != null && borderWidth > 0
        ? [
            strokeBorder({
              content: borderColor,
              style: { lineWidth: borderWidth },
              shape: 'roundedRectangle',
              cornerRadius: typeof borderRadius === 'number' ? borderRadius : 0,
            }),
          ]
        : []),
    ],
  };
}

export function TextInputIconButton({
  children,
  disabled,
  onPress,
  accessibilityLabel,
  testID,
}: TextInputIconButtonProps) {
  return (
    <Button
      testID={testID}
      onPress={disabled ? undefined : onPress}
      modifiers={[
        buttonStyle('plain'),
        nativeDisabled(Boolean(disabled)),
        fixedSize({ horizontal: true, vertical: true }),
        ...(accessibilityLabel ? [nativeAccessibilityLabel(accessibilityLabel)] : []),
      ]}
    >
      {/* Size the label itself so the flexible text field cannot compress the icon. */}
      <HStack modifiers={[frame({ width: 48, height: 48 }), contentShape(shapes.rectangle())]}>
        {children}
      </HStack>
    </Button>
  );
}
