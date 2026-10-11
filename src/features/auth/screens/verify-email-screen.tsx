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

const resendSeconds = (deadline: number, now: number) =>
  Number.isFinite(deadline) ? Math.max(0, Math.ceil((deadline - now) / 1000)) : 0;
const codeExpired = (deadline: number, now: number) => Number.isFinite(deadline) && deadline <= now;

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
  const resendAt = Date.parse(challenge?.otpResendAvailableAtUtc ?? '');
  const expiresAt = Date.parse(challenge?.otpExpiresAtUtc ?? '');
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
    let timer: ReturnType<typeof setTimeout> | undefined;
    const tick = () => {
      const next = Date.now();
      setNow((current) =>
        resendSeconds(resendAt, current) === resendSeconds(resendAt, next) &&
        codeExpired(expiresAt, current) === codeExpired(expiresAt, next)
          ? current
          : next,
      );
      // Once resend is ready, wake only at expiry instead of rendering each second.
      const countdownDelay = resendAt > next ? Math.min(1000, resendAt - next) : Infinity;
      const expiryDelay = expiresAt > next ? expiresAt - next : Infinity;
      const delay = Math.min(countdownDelay, expiryDelay);
      if (Number.isFinite(delay)) timer = setTimeout(tick, delay);
    };
    tick();
    return () => clearTimeout(timer);
  }, [resendAt, expiresAt]);
  if (!challenge?.challengeId) return <Redirect href="/login" />;
  const seconds = resendSeconds(resendAt, now);
  const expired = codeExpired(expiresAt, now);
  const busy = pending || resend.isPending;
  const resendLabel = seconds > 0 ? t('auth.resendCountdown', { seconds }) : t('auth.resendCode');
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
          label={resend.isPending ? t('auth.sending') : resendLabel}
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
