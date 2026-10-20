/** Shared geometry for app-owned content; native controls retain their platform defaults. */
export const spacing = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radii = {
  none: 0,
  sm: 8,
  control: 12,
  card: 16,
  pill: 9999,
} as const;
