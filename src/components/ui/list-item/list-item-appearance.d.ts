import type { ListItemProps } from '@expo/ui';
import type { useThemeColors } from '@/hooks/use-theme';

export type ListItemColors = Pick<
  ReturnType<typeof useThemeColors>,
  'text' | 'muted' | 'controlSurface' | 'controlActive' | 'divider'
>;

export declare function listItemAppearance(
  props: ListItemProps,
  colors: ListItemColors,
): ListItemProps;
