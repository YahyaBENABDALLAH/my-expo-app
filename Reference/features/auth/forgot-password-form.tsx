import { useState } from "react";
import { AuthScreen } from "@/features/auth/components/auth-screen";
import { ICON_SIZE, space } from "@/constants/theme.tokens";
import { ControlledTextInput } from "@/components/Universal/text-input";
import { useAlert } from "@/components/ui/alert";
import { Button } from "@/components/Universal/button";
import { Icon, icons } from "@/components/Universal/icon";
import { useTheme } from "@/context/theme.context";
import { useAuthOperation } from "@/features/auth/use-auth-operation";
import { ForgotPasswordFormValues, getForgotPasswordSchema } from "@/resolvers";
import * as authApi from "@/services/auth/auth.api";
import { getAuthErrorMessage } from "@/services/auth/auth.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Keyboard, View } from "react-native";

export function ForgotPasswordForm() {
  const alert = useAlert();
  const [sent, setSent] = useState(false);
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { execute, isLoading } = useAuthOperation();

  const schema = getForgotPasswordSchema(t);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: ForgotPasswordFormValues) {
    Keyboard.dismiss();
    try {
      await execute(async () => {
        await authApi.forgotPassword({
          email: data.email.trim(),
        });
        setSent(true);
      });
    } catch (error) {
      alert.error(t("auth.errorTitle"), getAuthErrorMessage(error));
    }
  }

  if (sent)
    return (
      <AuthScreen
        back
        title={t("auth.recoveryEmailSentTitle")}
        subtitle={t("auth.recoveryEmailSent")}
      >
        <Button
          fullWidth
          variant="outlined"
          label={t("auth.tryAnotherEmail")}
          onPress={() => setSent(false)}
        />
      </AuthScreen>
    );

  return (
    <AuthScreen
      title={t("auth.forgotPasswordTitle")}
      subtitle={t("auth.forgotSubtitle")}
      back
    >
      <View style={{ gap: space(5) }}>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <ControlledTextInput
              label={t("auth.email")}
              placeholder="m@example.com"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="email-address"
              autoComplete="email"
              autoCapitalize="none"
              editable={!isLoading}
              leftIcon={
                <Icon
                  name={icons.mail}
                  size={ICON_SIZE.lg}
                  color={colors.primary}
                />
              }
              returnKeyType="send"
              onSubmitEditing={() => void handleSubmit(onSubmit)()}
              error={errors.email?.message}
            />
          )}
        />

        <Button
          fullWidth
          containerStyle={{ marginTop: space(2) }}
          size="lg"
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
          label={t("auth.continue")}
        />
      </View>
    </AuthScreen>
  );
}
