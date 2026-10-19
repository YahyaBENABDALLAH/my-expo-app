import {
  Column,
  Skeleton,
  SkeletonContent,
  UniversalHost,
  UniversalButtonContent,
  UniversalTextContent,
} from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { NativeStoryFrame } from '../../components/native-story-frame';

const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
  args: {
    animate: true,
    colorScheme: 'dark',
    testID: 'expo-ui-skeleton',
    style: { height: 20 },
  },
  argTypes: {
    animate: { control: 'boolean' },
    style: { control: 'object' },
  },
  render: (args) => (
    <NativeStoryFrame colorScheme={args.colorScheme}>
      <Skeleton {...args} />
    </NativeStoryFrame>
  ),
} satisfies Meta<typeof Skeleton>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Standalone Hosts exercise CSS playback without changing the native content stories. */
function AnimationControlsDemo({
  colorScheme = 'light',
  animate = true,
}: {
  colorScheme?: 'light' | 'dark';
  animate?: boolean;
}) {
  const [playing, setPlaying] = useState(true);
  return (
    <NativeStoryFrame colorScheme={colorScheme}>
      <UniversalHost colorScheme={colorScheme}>
        <Column spacing={12}>
          <SkeletonContent
            testID="skeleton-static-content"
            style={{ width: '100%', height: 16, opacity: 0.35 }}
          />
          <UniversalTextContent>Hosted content stays static</UniversalTextContent>
          <UniversalButtonContent
            variant="secondary"
            testID="skeleton-toggle-animation"
            label={animate && playing ? 'Pause animation' : 'Resume animation'}
            disabled={!animate}
            onPress={() => setPlaying((value) => !value)}
          />
          <UniversalTextContent testID="skeleton-animation-state">
            {animate && playing ? 'Animation playing' : 'Animation paused'}
          </UniversalTextContent>
        </Column>
      </UniversalHost>
      <Skeleton
        animate={animate && playing}
        colorScheme={colorScheme}
        testID="skeleton-css-fixed"
        style={{ width: 200, height: 28, opacity: 0.35 }}
      />
      <Skeleton
        animate={animate && playing}
        colorScheme={colorScheme}
        testID="skeleton-css-fill"
        style={{ width: '100%', height: 16 }}
      />
    </NativeStoryFrame>
  );
}

export const AnimationControls: Story = {
  args: { colorScheme: 'light' },
  render: (args) => <AnimationControlsDemo animate={args.animate} colorScheme={args.colorScheme} />,
};
