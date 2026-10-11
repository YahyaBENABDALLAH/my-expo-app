import type { Meta, StoryObj } from '@storybook/react-native';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { ThemePreferencesProvider } from '@/context/theme.context';
import { LayoutDirectionProvider, type LayoutDirection } from '@/context/layout-direction.context';
import { themes, type ThemeId } from '@/constants/themes/index';
import SettingsScreen from '@/features/settings/settings-screen';

function SettingsDemo({
  colorScheme,
  themeId,
  direction,
}: {
  colorScheme: 'light' | 'dark';
  themeId: ThemeId;
  direction: LayoutDirection;
}) {
  return (
    <SafeAreaInsetsContext.Provider value={{ top: 0, bottom: 0, left: 0, right: 0 }}>
      <LayoutDirectionProvider key={direction} initialDirection={direction}>
        <ThemePreferencesProvider
          key={`${themeId}-${colorScheme}`}
          initialTheme={themeId}
          initialColorScheme={colorScheme}
        >
          <SettingsScreen />
        </ThemePreferencesProvider>
      </LayoutDirectionProvider>
    </SafeAreaInsetsContext.Provider>
  );
}

const meta = {
  title: 'Pages/App Settings',
  component: SettingsDemo,
  args: { colorScheme: 'light', themeId: 'whatsapp', direction: 'ltr' },
  argTypes: {
    colorScheme: { control: 'select', options: ['light', 'dark'] },
    themeId: { control: 'select', options: Object.keys(themes) },
    direction: { control: 'select', options: ['ltr', 'rtl'] },
  },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof SettingsDemo>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Light: Story = {};
export const Dark: Story = { args: { colorScheme: 'dark' } };
export const RTL: Story = { args: { direction: 'rtl' } };
export const Facebook: Story = { args: { themeId: 'facebook' } };
export const Instagram: Story = { args: { themeId: 'instagram' } };
export const TikTok: Story = { args: { themeId: 'tiktok', colorScheme: 'dark' } };
