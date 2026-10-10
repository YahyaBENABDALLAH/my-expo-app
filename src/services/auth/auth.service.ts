import { ApiError } from '@/services/api.error';
import { getAuthFailure, isSessionInvalid } from './auth.errors';
import i18n from '@/lib/i18n';

export function getAuthErrorMessage(error: unknown): string {
  const { status, code } = getAuthFailure(error);
  if (status === 401 && code === 'INVALID_CREDENTIALS') return i18n.t('auth.invalidCredentials');
  if (isSessionInvalid(error)) return i18n.t('auth.sessionExpired');
  if (status >= 500) return i18n.t('auth.temporaryFailure');
  if (error instanceof ApiError)
    return Array.isArray(error.displayMessage)
      ? error.displayMessage.map(translateMessage).join('\n')
      : translateMessage(error.displayMessage);
  return error instanceof Error && i18n.exists(error.message)
    ? i18n.t(error.message)
    : i18n.t('auth.requestFailed');
}

function translateMessage(message: string) {
  return i18n.exists(message) ? i18n.t(message) : message;
}
