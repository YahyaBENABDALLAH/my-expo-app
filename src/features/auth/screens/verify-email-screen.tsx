import { useTranslation } from 'react-i18next';
import {
  Column,
  nativeFillWidth,
  useAuthTheme,
  UniversalButtonContent,
  AuthText,
  AuthScreenFrame,
  FormSubmit,
  FormTextInput,
} from '@components/ui';
import { useMutation } from '@tanstack/react-query';
import { Redirect, router } from 'expo-router';
import { useEffect, useState } from 'react';

import { useAuthFlow } from '../auth-flow.context';

import { useAuthForm } from '../hooks/use-auth-form';
import { verifyEmailResolver } from '@/validation/resolvers/auth';
import type { VerifyEmailFormValues } from '@/validation/schemas/auth';

export function VerifyEmailScreen() {
  const { t } = useTranslation();
  const {
    registrationChallenge: challenge,
    confirmRegistration,
    resendRegistration,
    canResendRegistration,
    clearChallenge,
  } = useAuthFlow();
  const { colors } = useAuthTheme();
  const [now, setNow] = useState(() => Date.now());
  const { form, submit, pending } = useAuthForm<VerifyEmailFormValues>(
    verifyEmailResolver,
    { code: '' },
    ({ code }) => confirmRegistration(code),
  );
  const resend = useMutation({
    mutationFn: resendRegistration,
    networkMode: 'always',
    retry: 0,
    onSuccess: () => {
      form.reset({ code: '' });
    },
  });
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  if (!challenge?.challengeId) return <Redirect href="/login" />;
  const resendAt = Date.parse(challenge.otpResendAvailableAtUtc ?? '');
  const expiresAt = Date.parse(challenge.otpExpiresAtUtc ?? '');
  const seconds = Number.isFinite(resendAt) ? Math.max(0, Math.ceil((resendAt - now) / 1000)) : 0;
  const expired = Number.isFinite(expiresAt) && expiresAt <= now;
  const busy = pending || resend.isPending;
  return (
    <AuthScreenFrame
      testID="auth-verify-email"
      title={t('auth.verifyEmailTitle')}
      description={t('auth.verificationDescription', {
        email: challenge.maskedEmail ?? t('auth.yourEmail'),
      })}
    >
      <Column spacing={20} modifiers={nativeFillWidth}>
        <FormTextInput
          control={form.control}
          name="code"
          testID="auth-verify-code"
          label={t('auth.verificationCode')}
          placeholder="123456"
          keyboardType="number-pad"
          autoComplete="one-time-code"
          maxLength={6}
          disabled={busy}
          onSubmitEditing={() => {
            if (!expired) void submit();
          }}
        />
        {expired ? (
          <AuthText textStyle={{ color: colors.error }}>{t('auth.codeExpired')}</AuthText>
        ) : (
          <FormSubmit
            testID="auth-verify-submit"
            label={t('auth.verifyEmail')}
            pending={busy}
            onPress={() => void submit()}
          />
        )}
        <UniversalButtonContent
          fullWidth
          variant="secondary"
          testID="auth-verify-resend"
          label={
            resend.isPending
              ? t('auth.sending')
              : seconds > 0
                ? t('auth.resendCountdown', { seconds })
                : t('auth.resendCode')
          }
          disabled={busy || seconds > 0 || !canResendRegistration}
          onPress={() => resend.mutate()}
        />
        {!canResendRegistration ? <AuthText>{t('auth.loginForCode')}</AuthText> : null}
      </Column>
      <UniversalButtonContent
        variant="link"
        label={t('auth.backToSignIn')}
        disabled={busy}
        onPress={() => {
          clearChallenge();
          router.dismissTo('/login');
        }}
      />
    </AuthScreenFrame>
  );
}
