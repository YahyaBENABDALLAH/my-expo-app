import { PageScreen, UniversalTextInputContent, UniversalTextContent } from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { ThemePreferencesProvider } from '@/context/theme.context';
import { LayoutDirectionProvider, type LayoutDirection } from '@/context/layout-direction.context';
import { useAppTheme } from '@/hooks/use-theme';
import { themes, type ThemeId } from '@/constants/themes/index';

function PageDraft() {
  const [draft, setDraft] = useState('');
  const { themeId, scheme } = useAppTheme();
  return (
    <PageScreen
      title="Page appearance"
      description="Scroll past your draft to change direction, appearance and brand at the bottom of the content."
      tab
    >
      <UniversalTextContent testID="page-appearance-status">
        {`${themes[themeId].label} · ${scheme}`}
      </UniversalTextContent>
      <UniversalTextInputContent
        label="Draft"
        onChangeText={setDraft}
        testID="page-appearance-draft"
      />
      <UniversalTextContent>{`Draft: ${draft}`}</UniversalTextContent>
    </PageScreen>
  );
}

function FooterDemo({
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
          <PageDraft />
        </ThemePreferencesProvider>
      </LayoutDirectionProvider>
    </SafeAreaInsetsContext.Provider>
  );
}

const meta = {
  title: 'Pages/Appearance footer',
  component: FooterDemo,
  args: { colorScheme: 'light', themeId: 'whatsapp', direction: 'ltr' },
  argTypes: {
    colorScheme: { control: 'select', options: ['light', 'dark'] },
    themeId: { control: 'select', options: Object.keys(themes) },
    direction: { control: 'select', options: ['ltr', 'rtl'] },
  },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof FooterDemo>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Light: Story = {};
export const Dark: Story = { args: { colorScheme: 'dark' } };
export const RTL: Story = { args: { direction: 'rtl' } };
export const Facebook: Story = { args: { themeId: 'facebook' } };
export const Instagram: Story = { args: { themeId: 'instagram' } };
export const TikTok: Story = { args: { themeId: 'tiktok', colorScheme: 'dark' } };
