import { useAlert } from "@/components/ui/alert";
import { useAuthFlow } from "@/features/auth/auth-flow.context";
import { useAuthOperation } from "@/features/auth/use-auth-operation";
import {
  acquireGoogleIdToken,
  isGoogleCancellation,
  isGoogleConfigurationError,
  isGooglePlayServicesError,
} from "@/services/auth/google-sign-in";
import { getAuthErrorMessage } from "@/services/auth/auth.service";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

function waitForNativeTransition() {
  return new Promise<void>((resolve) => setTimeout(resolve, 250));
}

/** Keeps Google UI and request state local to the form that started it. */
export function useGoogleSignIn() {
  const { signInWithGoogle } = useAuthFlow();
  const { execute, isLoading } = useAuthOperation();
  const alert = useAlert();
  const { t } = useTranslation();

  const startGoogleSignIn = useCallback(async () => {
    try {
      await execute(async () => {
        const idToken = await acquireGoogleIdToken();
        if (idToken) await signInWithGoogle(idToken);
      });
    } catch (error) {
      if (isGoogleCancellation(error)) return;

      await waitForNativeTransition();
      const message = isGoogleConfigurationError(error)
        ? t("auth.googleConfigurationError")
        : isGooglePlayServicesError(error)
          ? t("auth.googlePlayServicesUnavailable")
          : getAuthErrorMessage(error);
      alert.error(t("auth.errorTitle"), message);
    }
  }, [alert, execute, signInWithGoogle, t]);

  return { isGoogleLoading: isLoading, startGoogleSignIn };
}
