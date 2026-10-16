import {
  defaultMinSize,
  fillMaxSize,
  fillMaxWidth,
  weight,
  wrapContentHeight,
} from '@expo/ui/jetpack-compose/modifiers';

export const nativeFillWidth = [fillMaxWidth()];
export const nativeFillWidthEnd = nativeFillWidth;
export const nativeFillWidthCenter = nativeFillWidth;
export const nativeFillSize = [fillMaxSize()];
export const nativeRowWeight = [weight(1)];

/** Keep the minimum outside wrapping so short content centers and tall content scrolls. */
export const nativeCenteredMinHeight = (minHeight: number) => [
  fillMaxWidth(),
  defaultMinSize({ minHeight }),
  wrapContentHeight('centerVertically'),
];
