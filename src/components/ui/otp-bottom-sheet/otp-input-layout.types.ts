import type { TextInputProps } from '@expo/ui';
import type { ReactNode } from 'react';

export interface OtpInputLayoutProps {
  slots: ReactNode;
  input: TextInputProps;
  accessibilityLabel: string;
  height: number;
}
