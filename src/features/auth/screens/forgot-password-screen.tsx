import { spacing } from '@/constants/layout';
import { useTranslation } from 'react-i18next';
import {
  Column,
  nativeFillWidth,
  UniversalButtonContent,
  AuthScreenFrame,
  FormSubmit,
  FormTextInput,
} from '@components/ui';
import { useState } from 'react';

import { router } from 'expo-router';

import { useAuthForm } from '../hooks/use-auth-form';
import { forgotPassword } from '@/services/auth/auth.api';
import { forgotPasswordResolver } from '@/validation/resolvers/auth';
import type { ForgotPasswordFormValues } from '@/validation/schemas/auth';

export function ForgotPasswordScreen() {
  const { t } = useTranslation();
  const [sent, setSent] = useState(false);
  const { form, submit, pending } = useAuthForm<ForgotPasswordFormValues>(
    forgotPasswordResolver,
    { email: '' },
    async (values) => {
      await forgotPassword(values);
      setSent(true);
    },
  );
  return (
    <AuthScreenFrame
      testID="auth-forgot-password"
      title={sent ? t('auth.recoveryEmailSentTitle') : t('auth.forgotPassword')}
      description={sent ? t('auth.recoveryEmailSent') : t('auth.forgotPasswordSubtitle')}
    >
      {sent ? (
        <UniversalButtonContent
          fullWidth
          variant="secondary"
          label={t('auth.tryAnotherEmail')}
          testID="auth-forgot-password-retry"
          onPress={() => {
            setSent(false);
          }}
        />
      ) : (
        <Column spacing={spacing.lg} modifiers={nativeFillWidth}>
          <FormTextInput
            control={form.control}
            name="email"
            testID="auth-forgot-password-email"
            label={t('auth.email')}
            placeholder={t('auth.emailPlaceholder')}
            keyboardType="email-address"
            autoComplete="email"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="send"
            onSubmitEditing={() => void submit()}
            disabled={pending}
          />
          <FormSubmit
            testID="auth-forgot-password-submit"
            label={t('auth.sendRecovery')}
            pending={pending}
            onPress={() => void submit()}
          />
        </Column>
      )}
      <UniversalButtonContent
        testID="auth-forgot-password-login"
        variant="link"
        label={t('auth.backToSignIn')}
        disabled={pending}
        onPress={() => router.dismissTo('/login')}
      />
    </AuthScreenFrame>
  );
}
