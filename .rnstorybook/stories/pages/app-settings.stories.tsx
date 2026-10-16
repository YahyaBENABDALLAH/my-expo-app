import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import { View } from 'react-native';
import { AuroraBackground } from '@components/ui';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { ThemePreferencesProvider, type ColorSchemePreference } from '@/context/theme.context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  LayoutDirectionProvider,
  useLayoutDirectionSettings,
  type LayoutDirection,
} from '@/context/layout-direction.context';
import { themes, type ThemeId } from '@/constants/themes/index';
import { SettingsPage } from '@/features/settings/settings-screen';
import i18n, { type Language } from '@/lib/i18n';

const zeroInsets = { top: 0, bottom: 0, left: 0, right: 0 };

function SettingsDemo({
  colorScheme,
  themeId,
  direction,
}: {
  colorScheme: ColorSchemePreference;
  themeId: ThemeId;
  direction: LayoutDirection;
}) {
  return (
    <SafeAreaInsetsContext.Provider value={zeroInsets}>
      <LayoutDirectionProvider key={direction} initialDirection={direction}>
        <ThemePreferencesProvider
          key={`${themeId}-${colorScheme}`}
          initialTheme={themeId}
          initialColorScheme={colorScheme}
        >
          <SettingsPreview key={direction} initialLanguage={direction === 'rtl' ? 'ar' : 'fr'} />
        </ThemePreferencesProvider>
      </LayoutDirectionProvider>
    </SafeAreaInsetsContext.Provider>
  );
}

function SettingsPreview({ initialLanguage }: { initialLanguage: Language }) {
  const colorScheme = useColorScheme();
  const [language, setLanguage] = useState(initialLanguage);
  const [previewI18n] = useState(() =>
    i18n.cloneInstance({ lng: initialLanguage, initAsync: false }),
  );
  const { setDirection } = useLayoutDirectionSettings();
  return (
    <I18nextProvider i18n={previewI18n}>
      <View style={{ flex: 1 }}>
        <AuroraBackground
          animate={false}
          colorScheme={colorScheme}
          style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
        />
        <SettingsPage
          language={language}
          onLanguageChange={(value) => {
            setLanguage(value);
            void previewI18n.changeLanguage(value);
            setDirection(value === 'ar' ? 'rtl' : 'ltr');
          }}
        />
      </View>
    </I18nextProvider>
  );
}

const meta = {
  title: 'Pages/App Settings',
  component: SettingsDemo,
  args: { colorScheme: 'light', themeId: 'ux', direction: 'ltr' },
  argTypes: {
    colorScheme: { control: 'select', options: ['system', 'light', 'dark'] },
    themeId: { control: 'select', options: Object.keys(themes) },
    direction: { control: 'select', options: ['ltr', 'rtl'] },
  },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof SettingsDemo>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Light: Story = {};
export const Dark: Story = { args: { colorScheme: 'dark' } };
export const System: Story = { args: { colorScheme: 'system' } };
export const RTL: Story = { args: { direction: 'rtl' } };
