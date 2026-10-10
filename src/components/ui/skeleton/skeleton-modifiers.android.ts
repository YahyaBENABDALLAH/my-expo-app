import {
  background,
  clip,
  fillMaxWidth,
  height,
  Shapes,
  size,
  tween,
} from '@expo/ui/jetpack-compose/modifiers';
import { processColor } from 'react-native';
import type { SkeletonShapeStyle } from './skeleton-modifiers';

export function skeletonModifiers(style: SkeletonShapeStyle) {
  // Apply opacity to the only painted content, without allocating a graphics layer.
  const color = processColor(style.backgroundColor);
  const fill =
    typeof color === 'number'
      ? `#${(color & 0xffffff).toString(16).padStart(6, '0')}${Math.round(
          (color >>> 24) * Math.min(1, Math.max(0, style.opacity)),
        )
          .toString(16)
          .padStart(2, '0')}`
      : style.backgroundColor;
  return [
    ...(style.width === undefined
      ? [fillMaxWidth(), height(style.height)]
      : [size(style.width, style.height)]),
    clip(Shapes.RoundedCorner(style.borderRadius)),
    background(
      fill,
      style.animationDuration === undefined
        ? undefined
        : { animationSpec: tween({ durationMillis: style.animationDuration, easing: 'ease' }) },
    ),
  ];
}
