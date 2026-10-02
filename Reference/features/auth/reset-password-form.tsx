import { Button } from "@/components/Universal/button";
import { useAlert } from "@/components/ui/alert";
import { AuthScreen } from "@/features/auth/components/auth-screen";
import { OtpSheet } from "@/features/auth/components/otp-sheet";
import { PasswordField } from "@/features/auth/components/password-field";
import { getResetPasswordSchema } from "@/resolvers";
import * as authApi from "@/services/auth/auth.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Keyboard } from "react-native";

export function ResetPasswordForm() {
  const router = useRouter();
  const params = useLocalSearchParams<{ challengeId?: string | string[] }>();
  const challengeId = Array.isArray(params.challengeId)
    ? params.challengeId[0]
    : params.challengeId;
  const [password, setPassword] = useState<string | null>(null);
  const alert = useAlert();
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<{ newPassword: string }>({
    resolver: zodResolver(
      getResetPasswordSchema(t).pick({ newPassword: true }),
    ),
    defaultValues: { newPassword: "" },
  });

  if (!challengeId)
    return (
      <AuthScreen
        back
        title={t("auth.recoveryLinkMissingTitle")}
        subtitle={t("auth.recoveryLinkMissing")}
      >
        <Button
          fullWidth
          label={t("auth.requestNewRecoveryLink")}
          onPress={() => router.replace("/(auth)/forgot-password")}
        />
      </AuthScreen>
    );

  const openCode = handleSubmit((data) => {
    Keyboard.dismiss();
    setPassword(data.newPassword);
  });
  return (
    <AuthScreen
      back
      title={t("auth.resetPasswordTitle")}
      subtitle={t("auth.resetPasswordSubtitle")}
    >
      <Controller
        control={control}
        name="newPassword"
        render={({ field: { onChange, onBlur, value } }) => (
          <PasswordField
            autoComplete="new-password"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            editable={password === null}
            returnKeyType="done"
            onSubmitEditing={() => void openCode()}
            error={errors.newPassword?.message}
          />
        )}
      />
      <Button
        fullWidth
        size="lg"
        label={t("auth.continue")}
        onPress={openCode}
      />
      {password !== null ? (
        <OtpSheet
          title={t("auth.verificationCode")}
          description={t("auth.verifyEmailSubtitle")}
          onDismiss={() => setPassword(null)}
          onSubmit={async (code) => {
            await authApi.resetPassword({
              challengeId,
              code,
              newPassword: password,
            });
          }}
          onSuccess={() => {
            alert.success(
              t("auth.passwordResetTitle"),
              t("auth.passwordResetSuccess"),
            );
            router.replace("/(auth)");
          }}
        />
      ) : null}
    </AuthScreen>
  );
}
