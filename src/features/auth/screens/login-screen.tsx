import { useTranslation } from 'react-i18next';
import {
  Column,
  nativeFillWidth,
  nativeFillWidthEnd,
  UniversalButtonContent,
  AuthScreenFrame,
  FormSubmit,
  FormTextInput,
  authInputIcons,
} from '@components/ui';
import { router } from 'expo-router';

import { useAuthForm } from '../hooks/use-auth-form';
import { useAuthFlow } from '../auth-flow.context';
import { loginResolver } from '@/validation/resolvers/auth';
import type { LoginFormValues } from '@/validation/schemas/auth';
import { useAuthContext } from '@/context/auth.context';
import { appDevEnabled } from '@/constants/app-dev';
import { useEffect, useState } from 'react';

export function LoginScreen() {
  const { t } = useTranslation();
  const { signIn } = useAuthFlow();
  const { developmentGuest, enterDevelopmentGuest } = useAuthContext();
  const [openGuestPages, setOpenGuestPages] = useState(false);
  useEffect(() => {
    if (openGuestPages && developmentGuest) router.replace('/development-pages');
  }, [openGuestPages, developmentGuest]);
  const { form, submit, pending } = useAuthForm<LoginFormValues>(
    loginResolver,
    { login: '', password: '' },
    signIn,
  );
  return (
    <AuthScreenFrame
      testID="auth-login"
      title={t('auth.welcomeBack')}
      description={t('auth.loginDescription')}
    >
      {appDevEnabled && (
        <UniversalButtonContent
          fullWidth
          variant="secondary"
          label={t('tools.guestEntry')}
          testID="auth-development-guest"
          disabled={pending}
          onPress={() => {
            setOpenGuestPages(true);
            enterDevelopmentGuest();
          }}
        />
      )}
      <Column spacing={20} modifiers={nativeFillWidth}>
        <FormTextInput
          control={form.control}
          name="login"
          testID="auth-login-email"
          label={t('auth.identity')}
          leftIcon={authInputIcons.person}
          placeholder={t('auth.emailPlaceholder')}
          autoComplete="username"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          onSubmitEditing={() => form.setFocus('password')}
          disabled={pending}
        />
        <Column spacing={2} modifiers={nativeFillWidth}>
          <FormTextInput
            control={form.control}
            name="password"
            testID="auth-login-password"
            label={t('auth.password')}
            leftIcon={authInputIcons.password}
            passwordToggle="icon"
            placeholder={t('auth.enterPassword')}
            password
            autoComplete="current-password"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="send"
            onSubmitEditing={() => void submit()}
            disabled={pending}
          />
          <Column alignment="end" modifiers={nativeFillWidthEnd}>
            <UniversalButtonContent
              testID="auth-login-forgot-password"
              variant="link"
              label={t('auth.forgotPassword')}
              disabled={pending}
              onPress={() => router.push('/forgot-password')}
            />
          </Column>
        </Column>
        <FormSubmit
          testID="auth-login-submit"
          label={t('auth.signIn')}
          pending={pending}
          onPress={() => void submit()}
        />
      </Column>
      <UniversalButtonContent
        testID="auth-login-register"
        variant="link"
        label={t('auth.noAccountLink')}
        disabled={pending}
        onPress={() => router.push('/register')}
      />
    </AuthScreenFrame>
  );
}
