import type { ColorTokens } from '@/constants/colors';
import type { UniversalButtonVariant } from './universal-button.types';

/** Explicit semantic pairs for app compositions and native previews. */
export function semanticButtonColors(variant: UniversalButtonVariant, colors: ColorTokens) {
  switch (variant) {
    case 'primary':
      return { color: colors.primary, contentColor: colors.onPrimary };
    case 'secondary':
      return { color: colors.secondary, contentColor: colors.secondary };
    case 'link':
      return { color: colors.tint, contentColor: colors.tint };
    case 'success':
      return { color: colors.success, contentColor: colors.onSuccess };
    case 'warning':
      return { color: colors.warning, contentColor: colors.onWarning };
    case 'destructive':
      return { color: colors.error, contentColor: colors.onError };
    case 'glass':
      return { color: colors.surfaceVariant, contentColor: colors.text };
  }
}
