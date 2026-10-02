import { AuthScreen } from "@/features/auth/components/auth-screen";
import { ICON_SIZE, space } from "@/constants/theme.tokens";
import { Button } from "@/components/Universal/button";
import { Icon, icons } from "@/components/Universal/icon";
import { Host, Row } from "@/components/Universal/layout";
import { Text } from "@/components/Universal/text";
import {
  ControlledTextInput,
  type TextInputRef,
} from "@/components/Universal/text-input";
import { useAlert } from "@/components/ui/alert";
import { useAuthFlow } from "@/features/auth/auth-flow.context";
import { useAuthOperation } from "@/features/auth/use-auth-operation";
import { useGoogleSignIn } from "@/features/auth/use-google-sign-in";
import { PasswordField } from "@/features/auth/components/password-field";
import { useLanguageContext } from "@/context/language.context";
import { useTheme } from "@/context/theme.context";
import { getSignUpSchema, SignUpFormValues } from "@/resolvers";
import { getAuthErrorMessage } from "@/services/auth/auth.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Keyboard, View } from "react-native";

export function SignUpForm() {
  const firstNameInputRef = useRef<TextInputRef>(null);
  const lastNameInputRef = useRef<TextInputRef>(null);
  const emailInputRef = useRef<TextInputRef>(null);
  const passwordInputRef = useRef<TextInputRef>(null);

  const router = useRouter();
  const { register } = useAuthFlow();
  const { execute, isLoading } = useAuthOperation();
  const { isGoogleLoading, startGoogleSignIn } = useGoogleSignIn();
  const { language } = useLanguageContext();
  const { t } = useTranslation();
  const alert = useAlert();
  const { colors } = useTheme();
  const isBusy = isLoading || isGoogleLoading;

  const schema = getSignUpSchema(t);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      userName: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: SignUpFormValues) {
    Keyboard.dismiss();
    try {
      await execute(() => register({ ...data, preferredLanguage: language }));
    } catch (error) {
      alert.error(t("auth.errorTitle"), getAuthErrorMessage(error));
    }
  }

  return (
    <AuthScreen
      title={t("auth.createAccountTitle")}
      subtitle={t("auth.signUpSubtitle")}
      back
    >
      <View style={{ gap: space(5) }}>
        <Controller
          control={control}
          name="userName"
          render={({ field: { onChange, onBlur, value } }) => (
            <ControlledTextInput
              label={t("auth.username")}
              placeholder={t("auth.username")}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              autoComplete="username"
              autoCapitalize="none"
              editable={!isBusy}
              leftIcon={
                <Icon
                  name={icons.user}
                  size={ICON_SIZE.lg}
                  color={colors.primary}
                />
              }
              onSubmitEditing={() => firstNameInputRef.current?.focus()}
              returnKeyType="next"
              error={errors.userName?.message}
            />
          )}
        />
        <View style={{ flexDirection: "row", gap: space(2) }}>
          <Controller
            control={control}
            name="firstName"
            render={({ field: { onChange, onBlur, value } }) => (
              <ControlledTextInput
                containerStyle={{ flex: 1 }}
                ref={firstNameInputRef}
                label={t("auth.firstName")}
                placeholder={t("auth.firstName")}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoComplete="given-name"
                editable={!isBusy}
                onSubmitEditing={() => lastNameInputRef.current?.focus()}
                returnKeyType="next"
                error={errors.firstName?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="lastName"
            render={({ field: { onChange, onBlur, value } }) => (
              <ControlledTextInput
                containerStyle={{ flex: 1 }}
                ref={lastNameInputRef}
                label={t("auth.lastName")}
                placeholder={t("auth.lastName")}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoComplete="family-name"
                editable={!isBusy}
                onSubmitEditing={() => emailInputRef.current?.focus()}
                returnKeyType="next"
                error={errors.lastName?.message}
              />
            )}
          />
        </View>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <ControlledTextInput
              ref={emailInputRef}
              label={t("auth.email")}
              placeholder="m@example.com"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              keyboardType="email-address"
              autoComplete="email"
              autoCapitalize="none"
              editable={!isBusy}
              leftIcon={
                <Icon
                  name={icons.mail}
                  size={ICON_SIZE.lg}
                  color={colors.primary}
                />
              }
              onSubmitEditing={() => passwordInputRef.current?.focus()}
              returnKeyType="next"
              error={errors.email?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <PasswordField
              ref={passwordInputRef}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              autoComplete="new-password"
              editable={!isBusy}
              returnKeyType="send"
              onSubmitEditing={() => void handleSubmit(onSubmit)()}
              error={errors.password?.message}
            />
          )}
        />
        <Button
          fullWidth
          containerStyle={{ marginTop: space(1) }}
          size="lg"
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
          disabled={isGoogleLoading}
          label={t(isLoading ? "auth.creatingAccount" : "auth.signUp")}
        />
        <Text variant="small" semantic="muted" style={{ textAlign: "center" }}>
          {t("auth.or")}
        </Text>
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
          paddingTop: space(4),
          paddingBottom: space(2),
        }}
      >
        <Host matchContents>
          <Row alignment="center" spacing={space(1)}>
            <Text variant="small" semantic="muted">
              {t("auth.haveAccount")}
            </Text>
            <Button
              variant="text"
              semantic="secondary"
              size="sm"
              label={t("auth.signIn")}
              disabled={isBusy}
              onPress={() => router.replace("/(auth)")}
            />
          </Row>
        </Host>
      </View>
    </AuthScreen>
  );
}
