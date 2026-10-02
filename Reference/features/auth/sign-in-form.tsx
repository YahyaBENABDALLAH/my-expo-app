import { AuthScreen } from "@/features/auth/components/auth-screen";
import { ICON_SIZE, space } from "@/constants/theme.tokens";
import { Button } from "@/components/Universal/button";
import { Host } from "@/components/Universal/host";
import { Icon, icons } from "@/components/Universal/icon";
import { Row, Spacer } from "@/components/Universal/layout";
import { Text } from "@/components/Universal/text";
import {
  ControlledTextInput,
  type TextInputRef,
} from "@/components/Universal/text-input";
import { useAlert } from "@/components/ui/alert";
import { useAuthFlow } from "@/features/auth/auth-flow.context";
import { useAuthOperation } from "@/features/auth/use-auth-operation";
import { PasswordField } from "@/features/auth/components/password-field";
import { useGoogleSignIn } from "@/features/auth/use-google-sign-in";
import { useTheme } from "@/context/theme.context";
import { getSignInSchema, SignInFormValues } from "@/resolvers";
import { getAuthErrorMessage } from "@/services/auth/auth.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Keyboard, View } from "react-native";

export function SignInForm() {
  const router = useRouter();
  const { signIn } = useAuthFlow();
  const { execute, isLoading } = useAuthOperation();
  const { isGoogleLoading, startGoogleSignIn } = useGoogleSignIn();
  const { t } = useTranslation();
  const alert = useAlert();
  const { colors } = useTheme();
  const passwordInputRef = useRef<TextInputRef>(null);
  const isBusy = isLoading || isGoogleLoading;

  const schema = getSignInSchema(t);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      login: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInFormValues) => {
    Keyboard.dismiss();
    try {
      await execute(() => signIn(data));
    } catch (error) {
      alert.error(t("auth.errorTitle"), getAuthErrorMessage(error));
    }
  };

  return (
    <AuthScreen
      title={t("auth.welcomeBack")}
      subtitle={t("auth.signInSubtitle")}
    >
      <View style={{ gap: space(5) }}>
        <Controller
          control={control}
          name="login"
          render={({ field: { onChange, onBlur, value } }) => (
            <ControlledTextInput
              label={t("auth.identity")}
              placeholder="m@example.com"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              autoComplete="username"
              autoCapitalize="none"
              keyboardType="email-address"
              leftIcon={
                <Icon
                  name={icons.user}
                  size={ICON_SIZE.lg}
                  color={colors.primary}
                />
              }
              returnKeyType="next"
              onSubmitEditing={() => passwordInputRef.current?.focus()}
              editable={!isBusy}
              error={errors.login?.message}
            />
          )}
        />
        <View style={{ gap: space(0.5) }}>
          <Host
            matchContents={{ horizontal: false, vertical: true }}
            useViewportSizeMeasurement
          >
            <Row alignment="center">
              <Text variant="small" semantic="muted">
                {t("auth.password")}
              </Text>
              <Spacer flexible />
              <Button
                variant="text"
                semantic="secondary"
                size="sm"
                label={t("auth.forgotPassword")}
                disabled={isBusy}
                onPress={() => router.navigate("/(auth)/forgot-password")}
              />
            </Row>
          </Host>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <PasswordField
                ref={passwordInputRef}
                label={undefined}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                returnKeyType="send"
                onSubmitEditing={() => void handleSubmit(onSubmit)()}
                editable={!isBusy}
                error={errors.password?.message}
              />
            )}
          />
        </View>
        <Button
          size="lg"
          fullWidth
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
          disabled={isGoogleLoading}
          label={t("auth.login")}
        />
        <View style={{ marginVertical: space(4) }}>
          <Text
            variant="small"
            semantic="muted"
            style={{ textAlign: "center" }}
          >
            {t("auth.or")}
          </Text>
        </View>
        <Button
          fullWidth
          variant="outlined"
          semantic="secondary"
          size="lg"
          loading={isGoogleLoading}
          disabled={isLoading}
          label={t("auth.continueWithGoogle")}
          onPress={() => void startGoogleSignIn()}
        />
      </View>
      <View
        style={{
          alignItems: "center",
          paddingTop: space(6),
          paddingBottom: space(2),
        }}
      >
        <Host matchContents>
          <Row alignment="center" spacing={space(1)}>
            <Text variant="small" semantic="muted">
              {t("auth.noAccount")}
            </Text>
            <Button
              variant="text"
              semantic="secondary"
              size="md"
              label={t("auth.signUp")}
              disabled={isBusy}
              onPress={() => router.navigate("/(auth)/sign-up")}
            />
          </Row>
        </Host>
      </View>
    </AuthScreen>
  );
}
