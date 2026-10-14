import Colors from '@/constants/colors';
import type { ReactNode } from 'react';

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
  /** Corner radius in iOS points / Android dp. Omit for native defaults; 0 is square. */
  borderRadius?: number;
  /** Override label padding, for example 0 for a whole recipe card. */
  contentPadding?: number;
  colorScheme?: 'light' | 'dark';
  palette?: UniversalButtonPalette;
};

const buttonColorRoles = {
  primary: ['primary', 'onPrimary'],
  secondary: ['secondary', 'onPrimary'],
  link: ['tint', 'onPrimary'],
  success: ['success', 'onSuccess'],
  warning: ['warning', 'onWarning'],
  destructive: ['error', 'onError'],
} as const;

export function buttonAppearance(
  variant: UniversalButtonVariant,
  scheme: 'light' | 'dark',
  palette?: UniversalButtonPalette,
) {
  const colors = palette ?? Colors[scheme];
  const filled = variant !== 'secondary' && variant !== 'link';
  const [accentRole, foregroundRole] = buttonColorRoles[variant];
  const accent = colors[accentRole] ?? colors.tint;
  const foreground = colors[foregroundRole];
  return {
    filled,
    accent,
    content: filled ? (foreground ?? palette?.onAccent ?? colors.background) : accent,
  };
}
