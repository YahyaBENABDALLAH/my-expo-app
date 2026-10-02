import { View } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuthReturn } from '@/features/auth/hooks/use-auth-return';

import { UniversalButton } from '@/components/ui/universal-button';
import { AuthScreenFrame } from '@/features/auth/components/auth-screen-frame';
import { AuthSubmit } from '@/features/auth/components/auth-submit';
import { FormTextInput } from '@/features/auth/components/form-text-input';
import { useValidatedAuthForm } from '@/features/auth/hooks/use-validated-auth-form';
import { forgotPasswordResolver } from '@/validation/resolvers/auth';
import type { ForgotPasswordFormValues } from '@/validation/schemas/auth';

export function ForgotPasswordScreen() {
  const scheme = useColorScheme();
  const returnToLogin = useAuthReturn();
  const { form, notice, submit, onEdited } = useValidatedAuthForm<ForgotPasswordFormValues>(
    forgotPasswordResolver,
    { email: '' },
    'Your email address looks good.',
  );
  return (
    <AuthScreenFrame
      testID="auth-forgot-password"
      description="Forgot your password? Enter the email address you use for your account."
    >
      <View style={{ gap: 24 }}>
        <FormTextInput
          control={form.control}
          name="email"
          testID="auth-forgot-password-email"
          label="Email address"
          placeholder="you@example.com"
          keyboardType="email-address"
          autoComplete="email"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="done"
          onSubmitEditing={() => {
            void submit();
          }}
          onEdited={onEdited}
        />
        <AuthSubmit
          testID="auth-forgot-password-submit"
          label="Reset password"
          pending={form.formState.isSubmitting}
          notice={notice}
          onPress={() => {
            void submit();
          }}
        />
      </View>
      <UniversalButton
        testID="auth-forgot-password-login"
        variant="link"
        colorScheme={scheme}
        label="Back to log in"
        onPress={returnToLogin}
      />
    </AuthScreenFrame>
  );
}
