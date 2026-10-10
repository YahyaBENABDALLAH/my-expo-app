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

import { router, useLocalSearchParams } from 'expo-router';
import { zodResolver } from '@hookform/resolvers/zod';

import { resetPassword } from '@/services/auth/auth.api';
import {
  isValidPasswordResetChallengeId,
  passwordResetSchema,
  type PasswordResetFormValues,
} from '@/validation/schemas/password-reset';

import { useAuthForm } from '../hooks/use-auth-form';

export function ResetPasswordScreen() {
  const { t } = useTranslation();
  const { challengeId } = useLocalSearchParams<{ challengeId?: string | string[] }>();
  const valid = isValidPasswordResetChallengeId(challengeId);
  const [saved, setSaved] = useState(false);
  const { form, submit, pending } = useAuthForm<PasswordResetFormValues>(
    zodResolver(passwordResetSchema),
    { code: '', newPassword: '', confirmPassword: '' },
    async (values) => {
      if (!valid) throw new Error(t('auth.openRecovery'));
      await resetPassword({ challengeId, code: values.code, newPassword: values.newPassword });
      setSaved(true);
    },
  );
  return (
    <AuthScreenFrame
      testID="auth-reset-password"
      title={saved ? t('auth.passwordResetTitle') : t('auth.resetPasswordTitle')}
      description={
        saved
          ? t('auth.resetComplete')
          : valid
            ? t('auth.resetDescription')
            : t('auth.missingRecoveryDescription')
      }
    >
      {valid && !saved && (
        <Column spacing={20} modifiers={nativeFillWidth}>
          <FormTextInput
            control={form.control}
            name="code"
            testID="auth-reset-password-code"
            label={t('auth.recoveryCode')}
            keyboardType="number-pad"
            disabled={pending}
          />
          <FormTextInput
            control={form.control}
            name="newPassword"
            testID="auth-reset-password-new-password"
            label={t('auth.newPassword')}
            secureTextEntry
            disabled={pending}
          />
          <FormTextInput
            control={form.control}
            name="confirmPassword"
            testID="auth-reset-password-confirm-password"
            label={t('auth.confirmPassword')}
            secureTextEntry
            disabled={pending}
          />
          <FormSubmit
            testID="auth-reset-password-submit"
            label={t('auth.updatePassword')}
            pending={pending}
            onPress={() => void submit()}
          />
        </Column>
      )}
      {!valid && (
        <UniversalButtonContent
          variant="primary"
          label={t('auth.requestRecovery')}
          testID="auth-reset-password-recovery"
          onPress={() => router.push('/forgot-password')}
        />
      )}
      <UniversalButtonContent
        label={t('auth.backToSignIn')}
        testID="auth-reset-password-login"
        variant="link"
        disabled={pending}
        onPress={() => router.dismissTo('/login')}
      />
    </AuthScreenFrame>
  );
}
