import { View } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuthReturn } from '@/features/auth/hooks/use-auth-return';

import { UniversalButton } from '@/components/ui/universal-button';
import { AuthScreenFrame } from '@/features/auth/components/auth-screen-frame';
import { AuthSubmit } from '@/features/auth/components/auth-submit';
import { FormTextInput } from '@/features/auth/components/form-text-input';
import { useValidatedAuthForm } from '@/features/auth/hooks/use-validated-auth-form';
import { registerResolver } from '@/validation/resolvers/auth';
import type { RegisterFormValues } from '@/validation/schemas/auth';

export function RegisterScreen() {
  const scheme = useColorScheme();
  const returnToLogin = useAuthReturn();
  const { form, notice, submit, onEdited } = useValidatedAuthForm<RegisterFormValues>(
    registerResolver,
    { name: '', email: '', password: '', confirmPassword: '' },
    'Your registration details look good.',
  );
  return (
    <AuthScreenFrame
      testID="auth-register"
      description="Start with your name, email, and a password for your account."
    >
      <View style={{ gap: 20 }}>
        <FormTextInput
          control={form.control}
          name="name"
          testID="auth-register-name"
          label="Full name"
          placeholder="Your name"
          autoComplete="name"
          autoCapitalize="words"
          onEdited={onEdited}
        />
        <FormTextInput
          control={form.control}
          name="email"
          testID="auth-register-email"
          label="Email address"
          placeholder="you@example.com"
          keyboardType="email-address"
          autoComplete="email"
          autoCapitalize="none"
          autoCorrect={false}
          onEdited={onEdited}
        />
        <FormTextInput
          control={form.control}
          name="password"
          testID="auth-register-password"
          label="Password"
          placeholder="Create a password"
          helperText="Use at least 8 characters."
          password
          autoComplete="new-password"
          autoCapitalize="none"
          autoCorrect={false}
          onEdited={onEdited}
        />
        <FormTextInput
          control={form.control}
          name="confirmPassword"
          testID="auth-register-confirm-password"
          label="Confirm password"
          placeholder="Re-enter your password"
          password
          autoComplete="new-password"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="done"
          onSubmitEditing={() => {
            void submit();
          }}
          onEdited={onEdited}
        />
        <AuthSubmit
          testID="auth-register-submit"
          label="Create account"
          pending={form.formState.isSubmitting}
          notice={notice}
          onPress={() => {
            void submit();
          }}
        />
      </View>
      <UniversalButton
        testID="auth-register-login"
        variant="link"
        colorScheme={scheme}
        label="Already have an account? Log in"
        onPress={returnToLogin}
      />
    </AuthScreenFrame>
  );
}
