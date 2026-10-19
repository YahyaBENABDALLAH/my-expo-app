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
import { useThemeColors } from '@/hooks/use-theme';
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

export const Dark: Story = {};
export const Static: Story = { args: { animate: false } };
export const Light: Story = { args: { colorScheme: 'light' } };

/** Reference's search-card arrangement, composed without nested Hosts or RN layout. */
function ReferenceCardDemo({ colorScheme = 'dark' }: { colorScheme?: 'light' | 'dark' }) {
  const colors = useThemeColors(colorScheme);
  return (
    <UniversalHost
      colorScheme={colorScheme}
      matchContents={false}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <ScrollView>
        <Column spacing={16} modifiers={nativeFillWidth} style={{ padding: 24 }}>
          <UniversalTextContent variant="title">Loading recipes</UniversalTextContent>

          <Column spacing={8} modifiers={nativeFillWidth}>
            <Row
              testID="skeleton-reference-card"
              spacing={8}
              modifiers={nativeFillWidth}
              style={{ backgroundColor: colors.surface, borderRadius: 14, padding: 8 }}
            >
              <SkeletonContent
                testID="skeleton-reference-image"
                style={{ width: 96, height: 96, borderRadius: 14 }}
              />
              <Column spacing={8} modifiers={nativeRowWeight}>
                <SkeletonContent style={{ width: 64, height: 12, borderRadius: 9999 }} />
                <SkeletonContent testID="skeleton-reference-title" style={{ height: 20 }} />
                <SkeletonContent style={{ width: 96, height: 20, borderRadius: 9999 }} />
                <Row spacing={12}>
                  <SkeletonContent style={{ width: 64, height: 12, borderRadius: 9999 }} />
                  <SkeletonContent style={{ width: 48, height: 12, borderRadius: 9999 }} />
                </Row>
              </Column>
            </Row>
            <SkeletonContent
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
  parameters: { controls: { include: ['themeId', 'colorScheme'] } },
  render: (args) => <ReferenceCardDemo colorScheme={args.colorScheme} />,
};

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
