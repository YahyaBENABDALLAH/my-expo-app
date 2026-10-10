import { AUTH_STATUS } from '@/constants/auth.constant';
import { appDevEnabled } from '@/constants/app-dev';
import { useAuthContext } from '@/context/auth.context';
import type { AuthStatus } from '@/constants/auth.constant';

export function authAccess(status: AuthStatus, appDev: boolean, guest: boolean) {
  return {
    requireAuth:
      status === AUTH_STATUS.AUTHENTICATED ||
      (appDev && guest && status === AUTH_STATUS.UNAUTHENTICATED),
    requireNoAuth: status === AUTH_STATUS.UNAUTHENTICATED,
    restoring: status === AUTH_STATUS.UNKNOWN,
  };
}

/** Shared predicates for Expo Router's native protected route groups. */
export function useAuthGuards() {
  const { status, developmentGuest } = useAuthContext();
  return authAccess(status, appDevEnabled, developmentGuest);
}
