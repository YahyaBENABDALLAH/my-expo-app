import { AUTH_STATUS, type AuthStatus } from "@/constants/auth.constant";
import { establishSession, restoreSession, signOut } from "@/services/auth/auth.lifecycle";
import {
  getSessionVersion,
  subscribeAuthSession,
} from "@/services/auth/auth.session";
import type { AuthUser } from "@/types/auth-session.types";
import type { TokenResponse } from "@/types/auth.types";
import { router, useRootNavigationState } from "expo-router";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";

interface AuthContextProps {
  status: AuthStatus;
  user: AuthUser | null;
  isAuthenticated: boolean;
  establishSession: (token: TokenResponse, expectedVersion: number) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const rootNavigationState = useRootNavigationState();
  const needsSignInRedirect = useRef(false);
  const [state, setState] = useState<{ status: AuthStatus; user: AuthUser | null }>({
    status: AUTH_STATUS.UNKNOWN,
    user: null,
  });

  useEffect(() => {
    let active = true;
    const apply = (user: AuthUser | null, authenticated: boolean) => {
      const status = authenticated ? AUTH_STATUS.AUTHENTICATED : AUTH_STATUS.UNAUTHENTICATED;
      if (active) setState(previous => previous.user === user && previous.status === status
        ? previous : { user, status });
    };
    const unsubscribe = subscribeAuthSession(({ session, reason }) => {
      needsSignInRedirect.current = reason === "cleared";
      if (reason === "cleared") {
        if (active) setState({ user: null, status: AUTH_STATUS.UNAUTHENTICATED });
      } else {
        apply(session?.user ?? null, Boolean(session));
      }
    });
    const version = getSessionVersion();

    async function bootstrap() {
      try {
        const session = await restoreSession();
        if (version === getSessionVersion()) apply(session?.user ?? null, Boolean(session));
      } catch {
        if (version === getSessionVersion()) apply(null, false);
      }
    }
    void bootstrap();
    return () => { active = false; unsubscribe(); };
  }, []);

  useEffect(() => {
    // Startup can reject stored credentials before the root Stack exists.
    if (needsSignInRedirect.current && rootNavigationState?.key && state.status === AUTH_STATUS.UNAUTHENTICATED) {
      needsSignInRedirect.current = false;
      router.replace("/(auth)");
    }
  }, [rootNavigationState?.key, state]);

  const value = useMemo<AuthContextProps>(() => ({
    ...state,
    isAuthenticated: state.status === AUTH_STATUS.AUTHENTICATED,
    establishSession,
    signOut,
  }), [state]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthContext must be used within an AuthProvider");
  return context;
}
