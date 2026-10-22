import { AUTH_STATUS, type AuthStatus } from '@/constants/auth.constant';
import { useAuthContext } from '@/context/auth.context';

export function authAccess(status: AuthStatus) {
  return {
    requireAuth: status === AUTH_STATUS.AUTHENTICATED,
    requireNoAuth: status === AUTH_STATUS.UNAUTHENTICATED,
    restoring: status === AUTH_STATUS.UNKNOWN,
  };
}

export function useAuthGuards() {
  return authAccess(useAuthContext().status);
}
