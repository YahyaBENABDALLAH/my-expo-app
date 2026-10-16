import {
  AuroraBackground,
  PageScreen,
  PageMotionOverlay,
  UniversalButtonContent,
  UniversalTextContent as Text,
} from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { View } from 'react-native';

function BackgroundDemo({
  animate,
  colorScheme,
  narrow = false,
}: {
  animate: boolean;
  colorScheme: 'light' | 'dark';
  narrow?: boolean;
}) {
  const [paused, setPaused] = useState(false);
  const [presses, setPresses] = useState(0);
  return (
    <View
      style={{
        flex: 1,
        minHeight: 600,
        width: narrow ? 280 : '100%',
        alignSelf: 'center',
      }}
    >
      <AuroraBackground
        colorScheme={colorScheme}
        animate={animate && !paused}
        style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
      />
      <PageScreen
        title="My recipes"
        description="The shared Skia aurora sits behind the page, with the original animated header wave above it."
        colorScheme={colorScheme}
        tab
      >
        <UniversalButtonContent
          variant="secondary"
          label="Try the button over the background"
          testID="aurora-action"
          onPress={() => setPresses((count) => count + 1)}
        />
        <Text testID="aurora-count">{`Button presses: ${presses}`}</Text>
        <UniversalButtonContent
          variant="secondary"
          label={paused ? 'Resume background' : 'Pause background'}
          testID="aurora-toggle"
          disabled={!animate}
          onPress={() => setPaused((value) => !value)}
        />
        <Text testID="aurora-status">
          {animate && !paused ? 'Motion requested' : 'Static background'}
        </Text>
      </PageScreen>
      <PageMotionOverlay animate={animate && !paused} colorScheme={colorScheme} />
    </View>
  );
}

const meta = {
  title: 'Pages/Skia background',
  component: BackgroundDemo,
  args: { animate: true, colorScheme: 'light' },
  argTypes: {
    animate: { control: 'boolean' },
    colorScheme: { control: 'select', options: ['light', 'dark'] },
    narrow: { control: 'boolean' },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Android limits the full-screen shader to 30 updates per second; iOS follows the display refresh rate. Pause/resume retains the current artwork without advancing through paused time. Both platforms respect app activity and Reduce Motion.',
      },
    },
  },
} satisfies Meta<typeof BackgroundDemo>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Light: Story = {};
export const Dark: Story = { args: { colorScheme: 'dark' } };
export const Static: Story = { args: { animate: false } };
