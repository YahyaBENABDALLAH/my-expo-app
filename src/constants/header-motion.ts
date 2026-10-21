export const HEADER_SHAPES = ['waves', 'ribbon', 'dunes', 'smoke', 'water', 'rain'] as const;
export type PageHeaderShape = (typeof HEADER_SHAPES)[number];
export const DEFAULT_HEADER_SHAPE: PageHeaderShape = 'smoke';

export function isHeaderShape(value: unknown): value is PageHeaderShape {
  return HEADER_SHAPES.some((shape) => shape === value);
}
