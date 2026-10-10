import type { ReactNode } from 'react';

/** Only the props implemented by both native icon buttons. */
export interface TextInputIconButtonProps {
  children: ReactNode;
  disabled?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
  testID?: string;
}
