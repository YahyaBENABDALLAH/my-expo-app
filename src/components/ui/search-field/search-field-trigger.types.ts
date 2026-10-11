import type { ReactElement } from 'react';

/** A native navigation button styled as the destination's search field. */
export type SearchFieldTriggerProps = {
  children: ReactElement;
  label: string;
  onPress: () => void;
  testID?: string;
  colorScheme: 'light' | 'dark';
};
