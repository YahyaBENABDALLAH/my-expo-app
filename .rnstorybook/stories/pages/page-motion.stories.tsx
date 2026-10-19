import {
  Column,
  UniversalButtonContent,
  PageMotionOverlay,
  UniversalHost,
  UniversalTextContent as Text,
} from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { View } from 'react-native';

import { useThemeColors } from '@/hooks/use-theme';

function PageMotionDemo({
  animate,
  colorScheme,
  narrow = false,
  login = false,
}: {
  animate: boolean;
  colorScheme: 'light' | 'dark';
  narrow?: boolean;
  login?: boolean;
}) {
  const colors = useThemeColors(colorScheme);
  const [paused, setPaused] = useState(false);
  const [presses, setPresses] = useState(0);
  return (
    <View
      style={{
        flex: 1,
        width: narrow ? 280 : '100%',
        alignSelf: 'center',
        backgroundColor: colors.background,
      }}
    >
      <UniversalHost colorScheme={colorScheme}>
        <Column spacing={12} style={{ padding: 24 }}>
          <Text colorScheme={colorScheme} variant="title">
            My recipes
          </Text>
          <Text colorScheme={colorScheme}>A gentle wave accompanies every page.</Text>
          <UniversalButtonContent
            variant="secondary"
            label={login ? 'Simulate login / reset' : 'Try the button under the wave'}
            testID="page-motion-action"
            onPress={() => setPresses((value) => value + 1)}
          />
          <Text colorScheme={colorScheme} testID="page-motion-count">
            {`Button presses: ${presses}`}
          </Text>
          <UniversalButtonContent
            variant="secondary"
            label={paused ? 'Resume wave' : 'Pause wave'}
            testID="page-motion-toggle"
            disabled={!animate}
            onPress={() => setPaused((value) => !value)}
          />
          <Text colorScheme={colorScheme} testID="page-motion-status">
            {animate && !paused ? 'Motion requested' : 'Static wave'}
          </Text>
        </Column>
      </UniversalHost>
      <PageMotionOverlay
        animate={animate && !paused}
        colorScheme={colorScheme}
        expanded={login && presses % 2 === 0}
      />
    </View>
  );
}

const meta = {
  title: 'Pages/Shared Skia motion',
  component: PageMotionDemo,
  args: { animate: true, colorScheme: 'light' },
  argTypes: {
    animate: { control: 'boolean' },
    narrow: { control: 'boolean' },
  },
} satisfies Meta<typeof PageMotionDemo>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Light: Story = {};
export const Dark: Story = { args: { colorScheme: 'dark' } };
export const Static: Story = { args: { animate: false } };
export const Login: Story = { args: { login: true } };
