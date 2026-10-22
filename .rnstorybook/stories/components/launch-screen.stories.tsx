import { LaunchScreen, UniversalButton } from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { ThemePreferencesProvider, useThemePreferences } from '@/context/theme.context';

function LaunchDemo({
  reducedMotion = false,
  waiting = false,
}: {
  reducedMotion?: boolean;
  waiting?: boolean;
}) {
  const [presented, setPresented] = useState(true);
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
        <UniversalButton
          variant="secondary"
          label="Replay launch"
          onPress={() => setPresented(true)}
        />
        {presented ? <LaunchScreen exiting={!waiting} onExitComplete={finish} /> : null}
      </View>
    </ThemePreferencesProvider>
  );
}

const meta = {
  title: 'Components/Launch Screen',
  component: LaunchDemo,
  args: { reducedMotion: false, waiting: false },
} satisfies Meta<typeof LaunchDemo>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Ready: Story = {};
export const Waiting: Story = { args: { waiting: true } };
export const ReducedMotion: Story = { args: { reducedMotion: true } };
