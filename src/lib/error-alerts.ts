import { isCancelledError } from '@tanstack/react-query';
import { isAxiosError, isCancel } from 'axios';
import { SessionChangedError } from '@/services/auth/auth.errors';
import { getAuthErrorMessage } from '@/services/auth/auth.service';
import i18n from '@/lib/i18n';
import { showAlert } from './alerts';

/** Shared by cache callbacks and imperative auth work; contains no rendering code. */
export function reportErrorAlert(error: unknown) {
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
  showAlert({ variant: 'error', message });
}
