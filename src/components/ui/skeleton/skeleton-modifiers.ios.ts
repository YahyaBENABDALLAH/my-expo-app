import {
  accessibilityHidden,
  Animation,
  animation,
  background,
  clipShape,
  frame,
  opacity,
} from '@expo/ui/swift-ui/modifiers';
import type { SkeletonShapeStyle } from './skeleton-modifiers';

export function skeletonModifiers(style: SkeletonShapeStyle) {
  return [
    frame({ width: style.width, height: style.height }),
    // Fixed and flexible frames are separate in the installed native implementation.
    ...(style.width === undefined ? [frame({ maxWidth: Infinity })] : []),
    background(style.backgroundColor),
    clipShape('roundedRectangle', style.borderRadius),
    opacity(style.opacity),
    ...(style.animationDuration === undefined
      ? []
      : [
          animation(
            Animation.easeInOut({ duration: style.animationDuration / 1000 }),
            style.opacity,
          ),
        ]),
    accessibilityHidden(true),
  ];
}
