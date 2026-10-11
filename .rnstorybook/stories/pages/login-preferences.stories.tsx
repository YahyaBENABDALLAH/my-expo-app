import {
  AuthScreenFrame,
  LoginPreferences,
  NativeField,
  UniversalTextContent as Text,
} from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ThemePreferencesProvider } from '@/context/theme.context';
import { useLanguage } from '@/context/language.context';
import { useLayoutDirection } from '@/context/layout-direction.context';
import { useColorScheme } from '@/hooks/use-color-scheme';

function LoginDraft() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const scheme = useColorScheme();
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
      <Text testID="login-preferences-draft-value">{draft}</Text>
    </AuthScreenFrame>
  );
}

function LoginPreferencesDemo({ colorScheme }: { colorScheme: 'light' | 'dark' }) {
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
  argTypes: { colorScheme: { control: 'select', options: ['light', 'dark'] } },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof LoginPreferencesDemo>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Light: Story = {};
export const Dark: Story = { args: { colorScheme: 'dark' } };
