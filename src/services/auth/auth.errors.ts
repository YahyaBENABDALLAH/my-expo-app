import { isAxiosError } from 'axios';
import { ApiError } from '@/services/api.error';

export function getAuthFailure(error: unknown) {
  let status = 0;
  let data: unknown;
  if (error instanceof ApiError) {
    status = error.status;
    data = error.data;
  } else if (isAxiosError(error)) {
    status = error.response?.status ?? 0;
    data = error.response?.data;
  }
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
