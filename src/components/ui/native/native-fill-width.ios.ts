import { frame } from '@expo/ui/swift-ui/modifiers';

export const nativeFillWidth = [frame({ maxWidth: Infinity, alignment: 'topLeading' })];
export const nativeFillWidthEnd = [frame({ maxWidth: Infinity, alignment: 'topTrailing' })];
export const nativeFillWidthCenter = [frame({ maxWidth: Infinity, alignment: 'top' })];
export const nativeFillSize = [frame({ maxWidth: Infinity, maxHeight: Infinity })];
export const nativeRowWeight = [frame({ maxWidth: Infinity })];

/** Fill a scroll viewport while allowing taller content to grow naturally. */
export const nativeCenteredMinHeight = (minHeight: number) => [
  frame({ maxWidth: Infinity, minHeight, alignment: 'center' }),
];
