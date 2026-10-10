import type { ScrollViewProps } from '@expo/ui';

/** Vertical native scrolling inside an existing Expo UI Host. The caller owns error feedback. */
export type RefreshableScrollViewProps = Omit<ScrollViewProps, 'direction'> & {
  onRefresh?: () => Promise<void>;
};
