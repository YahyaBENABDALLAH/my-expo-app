import { LaunchScreen, UniversalButton, UniversalText } from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { ThemePreferencesProvider, useThemePreferences } from '@/context/theme.context';
import { getAppBrand } from '@/config/brand';

function LaunchDemo({
  reducedMotion = false,
  waiting = false,
  mode = 'branded',
}: {
  reducedMotion?: boolean;
  waiting?: boolean;
  mode?: 'minimal' | 'branded';
}) {
  const [presented, setPresented] = useState(true);
  const brand = getAppBrand();
  const preferences = useThemePreferences();
  const finish = useCallback(() => setPresented(false), []);
  return (
    <ThemePreferencesProvider
      key={String(reducedMotion)}
      initialTheme={preferences?.themeId}
      initialColorScheme={preferences?.colorScheme ?? 'light'}
      initialReducedMotion={reducedMotion}
    >
      <View style={{ flex: 1 }}>
        <UniversalText testID="launch-preview-brand">{brand.name}</UniversalText>
        <UniversalButton
          variant="secondary"
          label="Replay launch"
          testID="launch-preview-replay"
          onPress={() => setPresented(true)}
        />
        {presented ? <LaunchScreen mode={mode} exiting={!waiting} onExitComplete={finish} /> : null}
      </View>
    </ThemePreferencesProvider>
  );
}

const meta = {
  title: 'Components/Launch Screen',
  component: LaunchDemo,
  args: { reducedMotion: false, waiting: false, mode: 'branded' },
  argTypes: { mode: { control: 'select', options: ['minimal', 'branded'] } },
} satisfies Meta<typeof LaunchDemo>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Ready: Story = {};
export const Waiting: Story = { args: { waiting: true } };
export const ReducedMotion: Story = { args: { reducedMotion: true } };
export const MinimalReady: Story = { args: { mode: 'minimal' } };
export const MinimalWaiting: Story = { args: { mode: 'minimal', waiting: true } };
