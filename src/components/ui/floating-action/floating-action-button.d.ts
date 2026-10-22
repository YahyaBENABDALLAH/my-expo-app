import type { ReactElement, ReactNode } from 'react';

export interface NativeFloatingActionButtonProps {
  children: ReactNode;
  color: string;
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

export declare function NativeFloatingActionButton(
  props: NativeFloatingActionButtonProps,
): ReactElement;
