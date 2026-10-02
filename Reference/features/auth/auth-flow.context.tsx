import { useAuthContext } from "@/context/auth.context";
import * as authApi from "@/services/auth/auth.api";
import { getSessionVersion, subscribeAuthSession } from "@/services/auth/auth.session";
import { getDeviceMetadata } from "@/services/auth/device-installation";
import type { AuthFlowResponse, LoginRequest, RegisterRequest, TokenResponse } from "@/types/auth.types";
import { router } from "expo-router";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";

interface AuthFlowContextValue {
  registrationChallenge: AuthFlowResponse | null;
  signIn: (request: Pick<LoginRequest, "login" | "password">) => Promise<void>;
  register: (request: RegisterRequest) => Promise<void>;
  confirmRegistration: (code: string) => Promise<void>;
  canResendRegistration: boolean;
  resendRegistration: () => Promise<void>;
  signInWithGoogle: (idToken: string) => Promise<void>;
  clearChallenge: () => void;
}

interface RegistrationChallengeState {
  response: AuthFlowResponse;
  email: string | null;
}

const AuthFlowContext = createContext<AuthFlowContextValue | undefined>(undefined);

/** Transient state exists only while the auth route group is mounted. */
export function AuthFlowProvider({ children }: PropsWithChildren) {
  const { establishSession } = useAuthContext();
  const [challengeState, setChallengeState] =
    useState<RegistrationChallengeState | null>(null);
  const mounted = useRef(true);
  const sequence = useRef(0);
  const committingSession = useRef(false);
  const invalidatePending = useCallback(() => {
    sequence.current += 1;
  }, []);

  useEffect(() => {
    mounted.current = true;
    const unsubscribe = subscribeAuthSession(({ reason }) => {
      if (reason !== "cleared") return;
      invalidatePending();
      committingSession.current = false;
      setChallengeState(null);
    });
    return () => {
      mounted.current = false;
      invalidatePending();
      committingSession.current = false;
      unsubscribe();
    };
  }, [invalidatePending]);

  const clearChallenge = useCallback(() => {
    if (committingSession.current) return;
    invalidatePending();
    setChallengeState(null);
  }, [invalidatePending]);

  const run = useCallback(async (
    request: () => Promise<AuthFlowResponse | TokenResponse>,
    challengeEmail: string | null = null,
  ) => {
    if (!mounted.current || committingSession.current) return;
    const id = ++sequence.current;
    const version = getSessionVersion();
    const isCurrent = () => mounted.current && sequence.current === id;
    const response = await request();
    if (!isCurrent() || version !== getSessionVersion()) return;

    let token: TokenResponse;
    if ("isOtpValidated" in response) {
      if (!response.isOtpValidated && response.challengeId) {
        setChallengeState({ response, email: challengeEmail });
        router.navigate("/(auth)/verify-email");
        return;
      }
      if (!response.isOtpValidated || !response.loginResponse) {
        throw new Error("Invalid authentication flow response.");
      }
      token = response.loginResponse;
    } else {
      token = response;
    }

    committingSession.current = true;
    try {
      await establishSession(token, version);
      if (isCurrent()) {
        setChallengeState(null);
      }
    } finally {
      if (sequence.current === id) committingSession.current = false;
    }
  }, [establishSession]);

  const registrationChallenge = challengeState?.response ?? null;
  const challengeId = registrationChallenge?.challengeId ?? null;
  const challengeEmail = challengeState?.email ?? null;
  const canResendRegistration = challengeEmail !== null;

  const signIn = useCallback(
    async (request: Pick<LoginRequest, "login" | "password">) => {
      const login = request.login.trim();
      await run(
        async () => authApi.login({
          ...request,
          login,
          ...(await getDeviceMetadata()),
        }),
        login.includes("@") ? login : null,
      );
    },
    [run],
  );

  const register = useCallback(
    (request: RegisterRequest) => run(
      () => authApi.register(request),
      request.email.trim(),
    ),
    [run],
  );

  const confirmRegistration = useCallback(
    (code: string) => run(async () => {
      if (!challengeId) {
        throw new Error("Missing verification challenge.");
      }
      return authApi.confirmRegistration({
        challengeId,
        code: code.trim(),
        ...(await getDeviceMetadata()),
      });
    }),
    [challengeId, run],
  );

  const resendRegistration = useCallback(async () => {
    if (!challengeEmail) throw new Error("Missing registration email.");
    await run(
      () => authApi.resendRegistration({ email: challengeEmail }),
      challengeEmail,
    );
  }, [challengeEmail, run]);

  const signInWithGoogle = useCallback(
    (idToken: string) => run(async () => authApi.googleSignIn({
      idToken,
      ...(await getDeviceMetadata()),
    })),
    [run],
  );

  const value = useMemo<AuthFlowContextValue>(() => ({
    registrationChallenge,
    signIn,
    register,
    confirmRegistration,
    canResendRegistration,
    resendRegistration,
    signInWithGoogle,
    clearChallenge,
  }), [
    canResendRegistration,
    clearChallenge,
    confirmRegistration,
    register,
    registrationChallenge,
    resendRegistration,
    signIn,
    signInWithGoogle,
  ]);

  return (
    <AuthFlowContext.Provider value={value}>
      {children}
    </AuthFlowContext.Provider>
  );
}

export function useAuthFlow() {
  const context = useContext(AuthFlowContext);
  if (!context) throw new Error("useAuthFlow must be used within AuthFlowProvider");
  return context;
}
