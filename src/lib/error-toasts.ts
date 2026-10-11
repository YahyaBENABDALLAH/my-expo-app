import { isCancelledError } from '@tanstack/react-query';
import { isAxiosError, isCancel } from 'axios';
import { SessionChangedError } from '@/services/auth/auth.errors';
import { getAuthErrorMessage } from '@/services/auth/auth.service';
import i18n from '@/lib/i18n';
import { showToast } from './toasts';

// Existing integrations share the same queue as success and warning notifications.
export {
  getToast as getErrorToast,
  subscribeToasts as subscribeErrorToasts,
  dismissToast as dismissErrorToast,
} from './toasts';
export type { ToastNotification as ErrorToast } from './toasts';

/** Shared by cache callbacks and imperative auth work; contains no rendering code. */
export function reportErrorToast(error: unknown) {
  if (
    error instanceof SessionChangedError ||
    isCancelledError(error) ||
    isCancel(error) ||
    (isAxiosError(error) && error.code === 'ERR_CANCELED') ||
    (error instanceof Error && error.name === 'AbortError')
  ) {
    return;
  }
  const message = getAuthErrorMessage(error).trim() || i18n.t('auth.requestFailed');
  showToast({ variant: 'error', message });
}
