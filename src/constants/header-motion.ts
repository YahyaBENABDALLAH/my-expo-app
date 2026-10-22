export const HEADER_SHAPES = ['dunes', 'ribbon', 'rain'] as const;
export type PageHeaderShape = (typeof HEADER_SHAPES)[number];
export const DEFAULT_HEADER_SHAPE: PageHeaderShape = 'dunes';

export function isHeaderShape(value: unknown): value is PageHeaderShape {
  return HEADER_SHAPES.some((shape) => shape === value);
}
