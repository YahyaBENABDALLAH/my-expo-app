import type { ReactNode } from 'react';

export type UniversalButtonVariant =
  | 'primary'
  | 'secondary'
  | 'link'
  | 'success'
  | 'warning'
  | 'destructive'
  /** Native glass on iOS 26+; native automatic on older iOS, outlined on Android. */
  | 'glass';

export type UniversalButtonContentProps = {
  variant: UniversalButtonVariant;
  label?: string;
  children?: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  testID?: string;
  fullWidth?: boolean;
  /** Corner radius in iOS points / Android dp. Omit for native defaults; 0 is square. */
  borderRadius?: number;
  /** Override label padding, for example 0 for a whole recipe card. */
  contentPadding?: number;
  /** Override the variant's accent color. */
  color?: string;
  /** Override the native label color. */
  contentColor?: string;
};

export type UniversalButtonProps = UniversalButtonContentProps & {
  colorScheme?: 'light' | 'dark';
  /** Physical corners of the standalone Host. Overrides borderRadius; omitted corners are square. */
  cornerRadii?: {
    topLeft?: number;
    topRight?: number;
    bottomLeft?: number;
    bottomRight?: number;
  };
};
