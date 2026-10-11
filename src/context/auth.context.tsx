import { useTranslation } from 'react-i18next';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { AUTH_STATUS, type AuthStatus } from '@/constants/auth.constant';
import { appDevEnabled } from '@/constants/app-dev';
import { restoreSession, signOut } from '@/services/auth/auth.lifecycle';
import { getSessionVersion, subscribeAuthSession } from '@/services/auth/auth.session';
import type { AuthUser } from '@/types/auth-session.types';

type AuthState = { status: AuthStatus; user: AuthUser | null; error: string | null };
type AuthSnapshot = AuthState & { version: number };

/** Display fields are scalar; newly allocated but equal users do not change the UI. */
function sameUser(previous: AuthUser | null, next: AuthUser | null) {
  if (previous === next) return true;
  if (!previous || !next) return false;
  const keys = Object.keys(previous) as (keyof AuthUser)[];
  return (
    keys.length === Object.keys(next).length &&
    keys.every((key) => Object.is(previous[key], next[key]))
  );
}
const AuthContext = createContext<
  | (AuthState & {
      signOut: typeof signOut;
      retryRestore: () => void;
      developmentGuest: boolean;
      enterDevelopmentGuest: () => void;
      exitDevelopmentGuest: () => void;
    })
  | null
>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const { t } = useTranslation();
  const [attempt, setAttempt] = useState(0);
  const [guestEnabled, setGuestEnabled] = useState(false);
  const [state, setState] = useState<AuthSnapshot>({
    status: AUTH_STATUS.UNKNOWN,
    user: null,
    error: null,
    version: getSessionVersion(),
  });
  useEffect(() => {
    let active = true;
    const apply = (user: AuthUser | null, authenticated: boolean) => {
      if (!active) return;
      const status = authenticated ? AUTH_STATUS.AUTHENTICATED : AUTH_STATUS.UNAUTHENTICATED;
      const version = getSessionVersion();
      setState((current) =>
        current.version === version &&
        current.status === status &&
        current.error === null &&
        sameUser(current.user, user)
          ? current
          : { user, status, error: null, version },
      );
    };
    const unsubscribe = subscribeAuthSession(({ session }) =>
      apply(session?.user ?? null, Boolean(session)),
    );
    const version = getSessionVersion();
    void restoreSession()
      .then((session) => {
        if (version === getSessionVersion()) apply(session?.user ?? null, Boolean(session));
      })
      .catch(() => {
        if (active && version === getSessionVersion())
          setState({
            status: AUTH_STATUS.UNKNOWN,
            user: null,
            error: 'session.restoreFailed',
            version,
          });
      });
    return () => {
      active = false;
      unsubscribe();
    };
  }, [attempt]);
  const value = useMemo(
    () => ({
      status: state.status,
      user: state.user,
      error: state.error ? t(state.error) : null,
      developmentGuest:
        appDevEnabled && guestEnabled && state.status === AUTH_STATUS.UNAUTHENTICATED,
      enterDevelopmentGuest: () => {
        if (appDevEnabled && state.status === AUTH_STATUS.UNAUTHENTICATED) setGuestEnabled(true);
      },
      exitDevelopmentGuest: () => setGuestEnabled(false),
      signOut: async () => {
        setGuestEnabled(false);
        await signOut();
      },
      retryRestore: () => {
        setState({
          status: AUTH_STATUS.UNKNOWN,
          user: null,
          error: null,
          version: getSessionVersion(),
        });
        setAttempt((value) => value + 1);
      },
    }),
    [state, guestEnabled, t],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuthContext requires AuthProvider.');
  return context;
}
