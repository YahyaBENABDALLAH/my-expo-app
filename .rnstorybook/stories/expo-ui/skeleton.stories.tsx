import {
  Column,
  Row,
  ScrollView,
  Skeleton,
  SkeletonContent,
  UniversalHost,
  UniversalButtonContent,
  UniversalTextContent,
  nativeFillWidth,
  nativeRowWeight,
} from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import Colors from '@/constants/colors';
import { NativeStoryFrame } from '../../components/native-story-frame';

const meta = {
  title: 'Expo UI/Skeleton',
  component: Skeleton,
  args: {
    animate: true,
    colorScheme: 'dark',
    testID: 'expo-ui-skeleton',
    style: { height: 20 },
  },
  argTypes: {
    animate: { control: 'boolean' },
    colorScheme: { control: 'select', options: ['light', 'dark'] },
    style: { control: 'object' },
    testID: { control: 'text' },
  },
  render: (args) => (
    <NativeStoryFrame colorScheme={args.colorScheme}>
      <Skeleton {...args} />
    </NativeStoryFrame>
  ),
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Dark: Story = {};
export const Static: Story = { args: { animate: false } };
export const Light: Story = { args: { colorScheme: 'light' } };
export const Image: Story = { args: { style: { width: 240, height: 180 } } };
export const Circle: Story = {
  args: { style: { width: 64, height: 64, borderRadius: 9999 } },
};
export const Pill: Story = {
  args: { style: { width: 120, height: 20, borderRadius: 9999 } },
};
export const CustomAppearance: Story = {
  args: {
    style: {
      width: 160,
      height: 28,
      borderRadius: 4,
      backgroundColor: Colors.dark.tint,
      opacity: 0.35,
    },
  },
};

export const Opacity: Story = {
  args: { colorScheme: 'light' },
  render: (args) => (
    <UniversalHost
      colorScheme={args.colorScheme}
      matchContents={false}
      style={{ flex: 1, backgroundColor: Colors[args.colorScheme ?? 'light'].surface }}
    >
      <Column spacing={12} style={{ padding: 24 }}>
        <UniversalTextContent testID="skeleton-opacity-title">Opacity</UniversalTextContent>
        {[0, 0.35, 1].map((opacity) => (
          <Column key={opacity} spacing={4}>
            <UniversalTextContent>{`Opacity ${opacity}`}</UniversalTextContent>
            <SkeletonContent animate={false} style={{ width: 200, height: 24, opacity }} />
          </Column>
        ))}
      </Column>
    </UniversalHost>
  ),
};

/** Reference's search-card arrangement, composed without nested Hosts or RN layout. */
function ReferenceCardDemo({
  colorScheme = 'dark',
  narrow = false,
  animate = true,
  playback = false,
}: {
  colorScheme?: 'light' | 'dark';
  narrow?: boolean;
  animate?: boolean;
  playback?: boolean;
}) {
  const colors = Colors[colorScheme];
  const [playing, setPlaying] = useState(true);
  const motionEnabled = animate && playing;
  return (
    <UniversalHost
      colorScheme={colorScheme}
      matchContents={false}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <ScrollView>
        <Column spacing={16} modifiers={nativeFillWidth} style={{ padding: 24 }}>
          <UniversalTextContent variant="title">Loading recipes</UniversalTextContent>
          {playback && (
            <Column spacing={8}>
              <UniversalButtonContent
                variant="secondary"
                testID="skeleton-toggle-animation"
                label={playing ? 'Pause animation' : 'Resume animation'}
                onPress={() => setPlaying((value) => !value)}
              />
              <UniversalTextContent testID="skeleton-animation-state">
                {playing ? 'Animation playing' : 'Animation paused'}
              </UniversalTextContent>
            </Column>
          )}
          <Column
            spacing={8}
            modifiers={narrow ? undefined : nativeFillWidth}
            style={narrow ? { width: 248 } : undefined}
          >
            <Row
              testID="skeleton-reference-card"
              spacing={8}
              modifiers={nativeFillWidth}
              style={{ backgroundColor: colors.surface, borderRadius: 14, padding: 8 }}
            >
              <SkeletonContent
                animate={motionEnabled}
                testID="skeleton-reference-image"
                style={{ width: 96, height: 96, borderRadius: 14 }}
              />
              <Column spacing={8} modifiers={nativeRowWeight}>
                <SkeletonContent
                  animate={motionEnabled}
                  style={{ width: 64, height: 12, borderRadius: 9999 }}
                />
                <SkeletonContent
                  animate={motionEnabled}
                  testID="skeleton-reference-title"
                  style={{ height: 20 }}
                />
                <SkeletonContent
                  animate={motionEnabled}
                  style={{ width: 96, height: 20, borderRadius: 9999 }}
                />
                <Row spacing={12}>
                  <SkeletonContent
                    animate={motionEnabled}
                    style={{ width: 64, height: 12, borderRadius: 9999 }}
                  />
                  <SkeletonContent
                    animate={motionEnabled}
                    style={{ width: 48, height: 12, borderRadius: 9999 }}
                  />
                </Row>
              </Column>
            </Row>
            <SkeletonContent
              animate={motionEnabled}
              testID="skeleton-reference-full-width"
              style={{ width: '100%', height: 16 }}
            />
          </Column>
        </Column>
      </ScrollView>
    </UniversalHost>
  );
}

export const ReferenceCard: Story = {
  render: (args) => <ReferenceCardDemo animate={args.animate} colorScheme={args.colorScheme} />,
};

export const StaticReferenceCard: Story = {
  args: { animate: false },
  render: (args) => <ReferenceCardDemo animate={args.animate} colorScheme={args.colorScheme} />,
};
export const LightReferenceCard: Story = {
  args: { colorScheme: 'light' },
  render: (args) => <ReferenceCardDemo animate={args.animate} colorScheme={args.colorScheme} />,
};
export const NarrowReferenceCard: Story = {
  render: (args) => (
    <ReferenceCardDemo animate={args.animate} colorScheme={args.colorScheme} narrow />
  ),
};

export const AnimationControls: Story = {
  args: { colorScheme: 'light' },
  render: (args) => (
    <ReferenceCardDemo animate={args.animate} colorScheme={args.colorScheme} playback />
  ),
};
