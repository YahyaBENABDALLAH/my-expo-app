export const HEADER_SHAPES = ['dunes', 'ribbon', 'rain'] as const;
export type PageHeaderShape = (typeof HEADER_SHAPES)[number];
export const DEFAULT_HEADER_SHAPE: PageHeaderShape = 'dunes';
export const HEADER_STYLES = ['default', ...HEADER_SHAPES] as const;
export type PageHeaderStyle = (typeof HEADER_STYLES)[number];

export function isHeaderShape(value: unknown): value is PageHeaderShape {
  return HEADER_SHAPES.some((shape) => shape === value);
}

export function isHeaderStyle(value: unknown): value is PageHeaderStyle {
  return value === 'default' || isHeaderShape(value);
}
