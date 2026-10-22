import { FloatingAction, UniversalText, type FloatingActionKind } from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { View } from 'react-native';
import { ThemePreferencesProvider, useThemePreferences } from '@/context/theme.context';

function FloatingDemo({
  kind = 'create',
  disabled = false,
  reducedMotion = false,
}: {
  kind?: FloatingActionKind;
  disabled?: boolean;
  reducedMotion?: boolean;
}) {
  const [presses, setPresses] = useState(0);
  const preferences = useThemePreferences();
  return (
    <ThemePreferencesProvider
      key={String(reducedMotion)}
      initialTheme={preferences?.themeId}
      initialColorScheme={preferences?.colorScheme ?? 'light'}
      initialReducedMotion={reducedMotion}
    >
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <FloatingAction
          kind={kind}
          label="Count action"
          disabled={disabled}
          onPress={() => setPresses((value) => value + 1)}
        />
        <UniversalText testID="floating-demo-count">{`Actions: ${presses}`}</UniversalText>
      </View>
    </ThemePreferencesProvider>
  );
}

const meta = {
  title: 'Components/Floating Action',
  component: FloatingDemo,
  args: { kind: 'create', disabled: false, reducedMotion: false },
  argTypes: {
    kind: {
      control: 'select',
      options: ['create', 'continue', 'filters', 'active-filters', 'liked', 'profile', 'submit'],
    },
  },
} satisfies Meta<typeof FloatingDemo>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Interactive: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const ReducedMotion: Story = { args: { reducedMotion: true } };
