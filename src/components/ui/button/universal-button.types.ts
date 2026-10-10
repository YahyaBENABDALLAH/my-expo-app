import type { ReactNode } from 'react';
import Colors from '@/constants/colors';

export type UniversalButtonVariant =
  'primary' | 'secondary' | 'link' | 'success' | 'warning' | 'destructive';

export type UniversalButtonPalette = {
  tint: string;
  background: string;
  success: string;
  warning: string;
  error: string;
  primary?: string;
  secondary?: string;
  onPrimary?: string;
  onSuccess?: string;
  onWarning?: string;
  onError?: string;
  onAccent?: string;
};

export type UniversalButtonProps = {
  variant: UniversalButtonVariant;
  label?: string;
  children?: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  testID?: string;
  fullWidth?: boolean;
  /** Override native button geometry for custom content such as whole recipe cards. */
  borderRadius?: number;
  contentPadding?: number;
  colorScheme?: 'light' | 'dark';
  palette?: UniversalButtonPalette;
};

export function buttonAppearance(
  variant: UniversalButtonVariant,
  scheme: 'light' | 'dark',
  palette?: UniversalButtonPalette,
) {
  const colors = palette ?? Colors[scheme];
  const filled = variant !== 'secondary' && variant !== 'link';
  const accent =
    variant === 'success'
      ? colors.success
      : variant === 'warning'
        ? colors.warning
        : variant === 'destructive'
          ? colors.error
          : variant === 'secondary'
            ? (colors.secondary ?? colors.tint)
            : variant === 'link'
              ? colors.tint
              : (colors.primary ?? colors.tint);
  const foreground =
    variant === 'success'
      ? colors.onSuccess
      : variant === 'warning'
        ? colors.onWarning
        : variant === 'destructive'
          ? colors.onError
          : colors.onPrimary;
  return {
    filled,
    accent,
    content: filled ? (foreground ?? palette?.onAccent ?? colors.background) : accent,
  };
}
