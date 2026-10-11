import {
  AuroraBackground,
  Column,
  LaunchScreen,
  UniversalButtonContent,
  UniversalHost,
  UniversalTextContent as Text,
} from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useCallback, useState } from 'react';
import { View } from 'react-native';

function StartupDemo({ ready }: { ready: boolean }) {
  const [showLaunch, setShowLaunch] = useState(true);
  const finish = useCallback(() => setShowLaunch(false), []);
  return (
    <View style={{ flex: 1, minHeight: 600, overflow: 'hidden' }}>
      <AuroraBackground
        animate={!showLaunch}
        style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
      />
      <UniversalHost>
        <Column spacing={16} style={{ padding: 24 }}>
          <Text testID="startup-status">{showLaunch ? 'Splash visible' : 'Splash finished'}</Text>
          <UniversalButtonContent
            variant="secondary"
            label="Replay startup transition"
            testID="startup-replay"
            onPress={() => {
              setShowLaunch(true);
            }}
          />
        </Column>
      </UniversalHost>
      {showLaunch && <LaunchScreen exiting={ready} onExitComplete={finish} />}
    </View>
  );
}

const meta = {
  title: 'Pages/Animated splash',
  component: StartupDemo,
  args: { ready: true },
  argTypes: { ready: { control: 'boolean' } },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Startup stays visible while resources are unavailable. Ready triggers a 300-ms transition; reduced motion finishes immediately. Toggle ready to exercise both states.',
      },
    },
  },
} satisfies Meta<typeof StartupDemo>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Ready: Story = {};
export const Waiting: Story = { args: { ready: false } };
