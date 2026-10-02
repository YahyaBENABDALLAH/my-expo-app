import { Button } from "@/components/Universal/button";
import { AuthScreen } from "@/features/auth/components/auth-screen";
import { OtpSheet } from "@/features/auth/components/otp-sheet";
import { useAuthFlow } from "@/features/auth/auth-flow.context";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export function VerifyEmailForm() {
  const router = useRouter();
  const { t } = useTranslation();
  const {
    registrationChallenge: challenge,
    confirmRegistration,
    resendRegistration,
    canResendRegistration,
    clearChallenge,
  } = useAuthFlow();
  const [now, setNow] = useState(Date.now);
  const availableAt = Date.parse(challenge?.otpResendAvailableAtUtc ?? "") || 0;

  useEffect(() => {
    const timer = setTimeout(
      () => setNow(Date.now()),
      Math.max(0, availableAt - Date.now()),
    );
    return () => clearTimeout(timer);
  }, [availableAt]);

  function dismiss() {
    clearChallenge();
    router.replace("/(auth)");
  }

  if (!challenge?.challengeId) {
    return (
      <AuthScreen
        back
        title={t("auth.verificationSessionExpired")}
        subtitle={t("auth.registerAgain")}
      >
        <Button
          fullWidth
          label={t("auth.signUp")}
          onPress={() => router.replace("/(auth)/sign-up")}
        />
      </AuthScreen>
    );
  }

  const description = t("auth.verificationSentTo", {
    email: challenge.maskedEmail ?? t("auth.yourEmail"),
  });
  return (
    <AuthScreen title={t("auth.verifyEmailTitle")} subtitle={description}>
      <OtpSheet
        title={t("auth.verifyEmailTitle")}
        description={description}
        onDismiss={dismiss}
        onSubmit={confirmRegistration}
        onResend={canResendRegistration ? resendRegistration : undefined}
        resendAvailable={now >= availableAt}
      />
    </AuthScreen>
  );
}
