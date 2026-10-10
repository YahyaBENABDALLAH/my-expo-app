import { useTranslation } from 'react-i18next';
import {
  Column,
  nativeFillWidth,
  UniversalButtonContent,
  AuthScreenFrame,
  FormSubmit,
  FormTextInput,
  authInputIcons,
} from '@components/ui';
import { router } from 'expo-router';

import { useAuthForm } from '../hooks/use-auth-form';
import { useAuthFlow } from '../auth-flow.context';
import { registerResolver } from '@/validation/resolvers/auth';
import type { RegisterFormValues } from '@/validation/schemas/auth';

export function RegisterScreen() {
  const { t } = useTranslation();
  const { register } = useAuthFlow();
  const { form, submit, pending } = useAuthForm<RegisterFormValues>(
    registerResolver,
    { userName: '', firstName: '', lastName: '', email: '', password: '', confirmPassword: '' },
    ({ confirmPassword: _confirmation, ...values }) =>
      register({ ...values, preferredLanguage: 'en' }),
  );
  const shared = { control: form.control, disabled: pending };
  return (
    <AuthScreenFrame
      testID="auth-register"
      title={t('auth.signUpTitle')}
      description={t('auth.registerDescription')}
    >
      <Column spacing={20} modifiers={nativeFillWidth}>
        <FormTextInput
          {...shared}
          name="userName"
          testID="auth-register-username"
          label={t('auth.username')}
          leftIcon={authInputIcons.person}
          placeholder={t('auth.usernamePlaceholder')}
          autoComplete="username"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          onSubmitEditing={() => form.setFocus('firstName')}
        />
        <FormTextInput
          {...shared}
          name="firstName"
          testID="auth-register-first-name"
          label={t('auth.firstName')}
          leftIcon={authInputIcons.person}
          placeholder={t('auth.firstName')}
          autoComplete="given-name"
          autoCapitalize="words"
          returnKeyType="next"
          onSubmitEditing={() => form.setFocus('lastName')}
        />
        <FormTextInput
          {...shared}
          name="lastName"
          testID="auth-register-last-name"
          label={t('auth.lastName')}
          leftIcon={authInputIcons.person}
          placeholder={t('auth.lastName')}
          autoComplete="family-name"
          autoCapitalize="words"
          returnKeyType="next"
          onSubmitEditing={() => form.setFocus('email')}
        />
        <FormTextInput
          {...shared}
          name="email"
          testID="auth-register-email"
          label={t('auth.email')}
          leftIcon={authInputIcons.email}
          placeholder={t('auth.emailPlaceholder')}
          keyboardType="email-address"
          autoComplete="email"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          onSubmitEditing={() => form.setFocus('password')}
        />
        <FormTextInput
          {...shared}
          name="password"
          testID="auth-register-password"
          label={t('auth.password')}
          leftIcon={authInputIcons.password}
          passwordToggle="icon"
          placeholder={t('auth.createPassword')}
          helperText={t('auth.passwordMinLength')}
          password
          autoComplete="new-password"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
          onSubmitEditing={() => form.setFocus('confirmPassword')}
        />
        <FormTextInput
          {...shared}
          name="confirmPassword"
          testID="auth-register-confirm-password"
          label={t('auth.confirmPassword')}
          leftIcon={authInputIcons.password}
          passwordToggle="icon"
          placeholder={t('auth.repeatPassword')}
          password
          autoComplete="new-password"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="send"
          onSubmitEditing={() => void submit()}
        />
        <FormSubmit
          testID="auth-register-submit"
          label={t('auth.signUp')}
          pending={pending}
          onPress={() => void submit()}
        />
      </Column>
      <UniversalButtonContent
        testID="auth-register-login"
        variant="link"
        label={t('auth.haveAccountLink')}
        disabled={pending}
        onPress={() => router.dismissTo('/login')}
      />
    </AuthScreenFrame>
  );
}
