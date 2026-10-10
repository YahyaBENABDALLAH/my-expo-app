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
  const [state, setState] = useState<AuthState>({
    status: AUTH_STATUS.UNKNOWN,
    user: null,
    error: null,
  });
  useEffect(() => {
    let active = true;
    const apply = (user: AuthUser | null, authenticated: boolean) => {
      if (active)
        setState({
          user,
          status: authenticated ? AUTH_STATUS.AUTHENTICATED : AUTH_STATUS.UNAUTHENTICATED,
          error: null,
        });
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
          });
      });
    return () => {
      active = false;
      unsubscribe();
    };
  }, [attempt]);
  const value = useMemo(
    () => ({
      ...state,
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
        setState({ status: AUTH_STATUS.UNKNOWN, user: null, error: null });
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
