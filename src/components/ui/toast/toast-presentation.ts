import type { ColorTokens } from '@/constants/themes/tokens';
import type { ToastVariant } from './toast.types';

const titleKeys = {
  error: 'common.errorNotificationTitle',
  success: 'common.successNotificationTitle',
  warning: 'common.warningNotificationTitle',
  info: 'common.infoNotificationTitle',
} as const;

/** All variants share geometry; only semantic feedback colors and heading change. */
export function getToastPresentation(variant: ToastVariant, colors: ColorTokens) {
  return {
    accent: colors[variant],
    container: colors[`${variant}Container`],
    titleKey: titleKeys[variant],
  };
}
