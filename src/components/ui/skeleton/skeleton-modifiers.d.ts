import type { ColumnProps } from '@expo/ui';

export type SkeletonShapeStyle = {
  width?: number;
  height: number;
  borderRadius: number;
  backgroundColor: string;
  opacity: number;
};

/** Native sizing must precede the placeholder's background and clipping. */
export declare function skeletonModifiers(
  style: SkeletonShapeStyle,
): NonNullable<ColumnProps['modifiers']>;
