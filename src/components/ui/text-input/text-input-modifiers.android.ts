import type { RowProps } from '@expo/ui';
import {
  defaultMinSize,
  fillMaxWidth,
  semantics,
  weight,
} from '@expo/ui/jetpack-compose/modifiers';

export const inputRowFlex = [weight(1)];
export const rightIconLabel = (label: string) => [semantics({ contentDescription: label })];

export function inputFieldAppearance(
  style: NonNullable<RowProps['style']>,
): Pick<RowProps, 'style' | 'modifiers'> {
  return {
    style,
    modifiers: [
      ...(style.width === undefined ? [fillMaxWidth()] : []),
      ...(style.height === undefined ? [defaultMinSize({ minHeight: 48 })] : []),
    ],
  };
}
