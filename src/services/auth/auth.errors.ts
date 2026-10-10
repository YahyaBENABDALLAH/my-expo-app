import { isAxiosError } from 'axios';
import { ApiError } from '@/services/api.error';

export function getAuthFailure(error: unknown) {
  const status =
    error instanceof ApiError
      ? error.status
      : isAxiosError(error)
        ? (error.response?.status ?? 0)
        : 0;
  const data: unknown =
    error instanceof ApiError ? error.data : isAxiosError(error) ? error.response?.data : undefined;
  const code =
    data && typeof data === 'object' && 'code' in data && typeof data.code === 'string'
      ? data.code
      : undefined;
  return { status, code };
}

export function isSessionInvalid(error: unknown) {
  const { status, code } = getAuthFailure(error);
  return (
    status === 401 &&
    (code === 'REFRESH_TOKEN_INVALID' ||
      code === 'REFRESH_TOKEN_REUSE_DETECTED' ||
      code === 'ACCESS_SESSION_INVALID')
  );
}

/** An old request must never restore or invalidate a newer session. */
export class SessionChangedError extends Error {
  constructor() {
    super('The authentication session changed. Please try again.');
    this.name = 'SessionChangedError';
  }
}
