import type { RowProps } from '@expo/ui';
import {
  accessibilityLabel,
  background,
  clipShape,
  frame,
  strokeBorder,
  textFieldStyle,
} from '@expo/ui/swift-ui/modifiers';

// Both SecureField and TextField use the same unpadded native style.
export const inputRowFlex = [textFieldStyle('plain'), frame({ maxWidth: Infinity })];
export const rightIconLabel = (label: string) => [accessibilityLabel(label)];

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
