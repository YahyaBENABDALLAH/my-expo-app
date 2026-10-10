import {
  AuroraBackground,
  Column,
  LaunchScreen,
  UniversalButtonContent,
  UniversalHost,
  UniversalTextContent as Text,
} from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';

function StartupDemo() {
  const [showLaunch, setShowLaunch] = useState(true);
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const reveal = useCallback(() => setVisible(true), []);
  const finish = useCallback(() => setShowLaunch(false), []);
  useEffect(() => {
    if (!visible) return;
    const timeout = setTimeout(() => setExiting(true), 3000);
    return () => clearTimeout(timeout);
  }, [visible]);
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
            label="Replay three-second splash"
            testID="startup-replay"
            onPress={() => {
              setVisible(false);
              setExiting(false);
              setShowLaunch(true);
            }}
          />
        </Column>
      </UniversalHost>
      {showLaunch && <LaunchScreen exiting={exiting} onReady={reveal} onExitComplete={finish} />}
    </View>
  );
}

const meta = {
  title: 'Pages/Animated splash',
  component: StartupDemo,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Three-second splash followed by a two-second upward reveal, using the same moving wave paths as the page header.',
      },
    },
  },
} satisfies Meta<typeof StartupDemo>;
export default meta;
type Story = StoryObj<typeof meta>;
export const ThreeSeconds: Story = {};
