import {
  authInputIcons,
  Column,
  FieldGroup,
  FormSubmit,
  FormTextInput,
  ListItem,
  nativeFillSize,
  nativeFillWidth,
  PageFrame,
  Picker,
  UniversalTextContent as Text,
  UniversalButtonContent,
  UniversalHost,
  useAuthTheme,
} from '@components/ui';
import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useLanguage } from '@/context/language.context';
import i18n, { SUPPORTED_LANGUAGES, type Language } from '@/lib/i18n';
import { registerResolver } from '@/validation/resolvers/auth';
import type { RegisterFormValues } from '@/validation/schemas/auth';
import { useAuthFlow } from '../auth-flow.context';
import { useAuthForm } from '../hooks/use-auth-form';

const languageLabels: Record<Language, string> = {
  fr: 'common.french',
  en: 'common.english',
  ar: 'common.arabic',
};

export function RegisterScreen() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [preferredLanguage, setPreferredLanguage] = useState<Language>(language);
  const { colors, buttonPalette } = useAuthTheme();
  const insets = useSafeAreaInsets();
  const { register } = useAuthFlow();
  const { form, submit, pending } = useAuthForm<RegisterFormValues>(
    registerResolver,
    { userName: '', firstName: '', lastName: '', email: '', password: '', confirmPassword: '' },
    ({ confirmPassword: _confirmation, ...values }) => register({ ...values, preferredLanguage }),
  );
  const shared = { control: form.control, disabled: pending };
  return (
    <PageFrame>
      <KeyboardAvoidingView
        testID="auth-register"
        behavior="padding"
        style={{
          flex: 1,
          alignItems: 'center',
          paddingLeft: insets.left,
          paddingRight: insets.right,
          paddingBottom: insets.bottom,
        }}
      >
        <UniversalHost
          style={{ flex: 1, width: '100%', maxWidth: 480 }}
          seedColor={colors.tint}
          buttonPalette={buttonPalette}
          matchContents={false}
          ignoreSafeArea="all"
        >
          <FieldGroup
            testID="auth-register-scroll"
            modifiers={nativeFillSize}
            style={{ backgroundColor: 'transparent' }}
          >
            <Column spacing={12} modifiers={nativeFillWidth}>
              <Text variant="caption" fontWeight="700" textStyle={{ color: colors.tint }}>
                {t('brand.wordmark')}
              </Text>
              <Text variant="heading">{t('auth.signUpTitle')}</Text>
              <Text textStyle={{ color: colors.muted }}>{t('auth.registerDescription')}</Text>
            </Column>
            <FieldGroup.Section title={t('auth.profileSection')} testID="auth-register-profile">
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
              <FieldGroup.SectionFooter>
                <Text variant="caption" textStyle={{ color: colors.muted }}>
                  {t('auth.optionalNames')}
                </Text>
              </FieldGroup.SectionFooter>
            </FieldGroup.Section>
            <FieldGroup.Section title={t('auth.securitySection')} testID="auth-register-security">
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
            </FieldGroup.Section>
            <FieldGroup.Section title={t('auth.preferencesSection')}>
              <Column spacing={8} modifiers={nativeFillWidth}>
                <Text fontWeight="600">{t('auth.preferredLanguage')}</Text>
                <Picker<Language>
                  testID="auth-register-language"
                  selectedValue={preferredLanguage}
                  onValueChange={setPreferredLanguage}
                  enabled={!pending}
                  appearance="menu"
                >
                  {SUPPORTED_LANGUAGES.map((value) => (
                    <Picker.Item
                      key={value}
                      value={value}
                      label={i18n.getFixedT(value)(languageLabels[value])}
                    />
                  ))}
                </Picker>
              </Column>
              <FieldGroup.SectionFooter>
                <Text variant="caption" textStyle={{ color: colors.muted }}>
                  {t('auth.preferredLanguageHelp')}
                </Text>
              </FieldGroup.SectionFooter>
            </FieldGroup.Section>
            <FieldGroup.Section
              title={t('auth.accountIncludes')}
              testID="auth-register-account-list"
            >
              <ListItem
                testID="auth-register-verification-info"
                supportingText={t('auth.registrationVerificationHelp')}
              >
                {t('auth.verifyEmailTitle')}
              </ListItem>
              <ListItem
                testID="auth-register-recipes-info"
                supportingText={t('auth.registrationRecipesHelp')}
              >
                {t('common.myRecipes')}
              </ListItem>
            </FieldGroup.Section>
            <FieldGroup.Section>
              <Column spacing={12} modifiers={nativeFillWidth}>
                <FormSubmit
                  testID="auth-register-submit"
                  label={t('auth.signUp')}
                  pending={pending}
                  onPress={() => void submit()}
                />
                <UniversalButtonContent
                  testID="auth-register-login"
                  variant="link"
                  label={t('auth.haveAccountLink')}
                  disabled={pending}
                  onPress={() => router.dismissTo('/login')}
                />
              </Column>
            </FieldGroup.Section>
          </FieldGroup>
        </UniversalHost>
      </KeyboardAvoidingView>
    </PageFrame>
  );
}
