import {
  AuthScreenFrame,
  LoginPreferences,
  NativeField,
  UniversalTextContent as Text,
} from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useEffect, useState } from 'react';
import { Appearance } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  ThemePreferencesProvider,
  useThemePreferences,
  useThemeSettings,
  type ColorSchemePreference,
} from '@/context/theme.context';
import { useLanguage } from '@/context/language.context';
import { useLayoutDirection } from '@/context/layout-direction.context';
import { useColorScheme } from '@/hooks/use-color-scheme';

function LoginDraft() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { colorScheme } = useThemeSettings();
  const scheme = useColorScheme();
  useEffect(
    () => Appearance.setColorScheme(colorScheme === 'system' ? 'unspecified' : colorScheme),
    [colorScheme],
  );
  const direction = useLayoutDirection();
  const [draft, setDraft] = useState('');
  return (
    <AuthScreenFrame
      testID="login-preferences-example"
      title={t('auth.welcomeBack')}
      description={t('auth.loginDescription')}
      topBar={<LoginPreferences />}
    >
      <NativeField
        label={t('auth.identity')}
        value={draft}
        onChange={setDraft}
        testID="login-preferences-draft"
      />
      <Text testID="login-preferences-status">{`${language} · ${scheme} · ${direction}`}</Text>
      <Text testID="login-preferences-appearance">{colorScheme}</Text>
      <Text testID="login-preferences-draft-value">{draft}</Text>
    </AuthScreenFrame>
  );
}

function LoginPreferencesDemo({ colorScheme }: { colorScheme: ColorSchemePreference }) {
  const appAppearance = useThemePreferences()?.colorScheme ?? 'system';
  useEffect(
    () => () => {
      Appearance.setColorScheme(appAppearance === 'system' ? 'unspecified' : appAppearance);
    },
    [appAppearance],
  );
  return (
    <ThemePreferencesProvider key={colorScheme} initialColorScheme={colorScheme}>
      <LoginDraft />
    </ThemePreferencesProvider>
  );
}

const meta = {
  title: 'Pages/Login preferences',
  component: LoginPreferencesDemo,
  args: { colorScheme: 'light' },
  argTypes: { colorScheme: { control: 'select', options: ['system', 'light', 'dark'] } },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The top bar offers a native System/Light/Dark picker and a language sheet. Change appearance, select a language, dismiss and reopen the sheet while preserving the login draft. System follows live device appearance.',
      },
    },
  },
} satisfies Meta<typeof LoginPreferencesDemo>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Light: Story = {};
export const Dark: Story = { args: { colorScheme: 'dark' } };
