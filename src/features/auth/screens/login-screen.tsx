import { View } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';

import { UniversalButton } from '@/components/ui/universal-button';
import { AuthScreenFrame } from '@/features/auth/components/auth-screen-frame';
import { AuthSubmit } from '@/features/auth/components/auth-submit';
import { FormTextInput } from '@/features/auth/components/form-text-input';
import { useValidatedAuthForm } from '@/features/auth/hooks/use-validated-auth-form';
import { useAuthNavigation } from '@/features/auth/hooks/use-auth-navigation';
import { loginResolver } from '@/validation/resolvers/auth';
import type { LoginFormValues } from '@/validation/schemas/auth';

export function LoginScreen({ tabbed = false }: { tabbed?: boolean }) {
  const scheme = useColorScheme();
  const { openRegister, openForgotPassword } = useAuthNavigation(tabbed);
  const { form, notice, submit, onEdited } = useValidatedAuthForm<LoginFormValues>(
    loginResolver,
    { email: '', password: '' },
    'Your sign-in details look good.',
  );
  return (
    <AuthScreenFrame
      testID="auth-login"
      description="Welcome back. Enter your email and password to continue."
      tabbed={tabbed}
    >
      <View style={{ gap: 20 }}>
        <FormTextInput
          control={form.control}
          name="email"
          testID="auth-login-email"
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
          testID="auth-login-password"
          label="Password"
          placeholder="Enter your password"
          password
          autoComplete="current-password"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="done"
          onSubmitEditing={() => {
            void submit();
          }}
          onEdited={onEdited}
        />
        <View style={{ alignSelf: 'flex-end' }}>
          <UniversalButton
            testID="auth-login-forgot-password"
            variant="link"
            colorScheme={scheme}
            label="Forgot password?"
            onPress={openForgotPassword}
          />
        </View>
        <AuthSubmit
          testID="auth-login-submit"
          label="Log in"
          pending={form.formState.isSubmitting}
          notice={notice}
          onPress={() => {
            void submit();
          }}
        />
      </View>
      <UniversalButton
        testID="auth-login-register"
        variant="secondary"
        colorScheme={scheme}
        label="Create an account"
        onPress={openRegister}
      />
    </AuthScreenFrame>
  );
}
