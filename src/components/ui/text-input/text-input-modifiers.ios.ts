import type { RowProps } from '@expo/ui';
import { accessibilityLabel, frame, strokeBorder } from '@expo/ui/swift-ui/modifiers';

export const inputRowFlex = [frame({ maxWidth: Infinity })];
export const rightIconLabel = (label: string) => [accessibilityLabel(label)];

export function inputFieldAppearance(
  style: NonNullable<RowProps['style']>,
): Pick<RowProps, 'style' | 'modifiers'> {
  const { borderColor, borderWidth, ...surfaceStyle } = style;
  return {
    // SDK 57's rectangular style border gets cut off by the rounded clip.
    // Keep the surface clip and draw an inset stroke along the same shape.
    style: surfaceStyle,
    modifiers:
      borderColor != null && borderWidth != null && borderWidth > 0
        ? [
            strokeBorder({
              content: borderColor,
              style: { lineWidth: borderWidth },
              shape: 'roundedRectangle',
              cornerRadius: typeof style.borderRadius === 'number' ? style.borderRadius : 0,
            }),
          ]
        : [],
  };
}
