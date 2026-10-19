import { useThemeColors } from '@/hooks/use-theme';
import { Column, UniversalHost as Host, Row, Spacer, Text, type SpacerProps } from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { action } from 'storybook/actions';
import {
  NativeStoryFrame,
  nativeThemeControls,
  type NativeStoryTheme,
} from '../../components/native-story-frame';

type DemoProps = SpacerProps & NativeStoryTheme & { direction: 'vertical' | 'horizontal' };

function SpacerDemo({ colorScheme, seedColor, direction, ...args }: DemoProps) {
  const colors = useThemeColors(colorScheme);
  const Container = direction === 'horizontal' ? Row : Column;
  return (
    <Host
      testID={`${args.testID}-container`}
      collapsable={false}
      matchContents={{ vertical: true }}
      colorScheme={colorScheme}
      seedColor={seedColor}
      style={{ width: '100%' }}
    >
      <Container
        style={{
          width: 260,
          height: 240,
          padding: 16,
          backgroundColor: colors.surface,
          borderRadius: 12,
        }}
      >
        <Text
          testID={`${args.testID}-start`}
          style={{ padding: 8, backgroundColor: colors.primaryContainer, borderRadius: 8 }}
          textStyle={{ color: colors.onPrimaryContainer }}
        >
          Start
        </Text>
        <Spacer {...args} />
        <Text
          testID={`${args.testID}-end`}
          style={{ padding: 8, backgroundColor: colors.primaryContainer, borderRadius: 8 }}
          textStyle={{ color: colors.onPrimaryContainer }}
        >
          End
        </Text>
      </Container>
    </Host>
  );
}

const meta = {
  title: 'Expo UI/Universal Spacer',
  component: SpacerDemo,
  args: {
    testID: 'expo-ui-spacer',
    size: 24,
    flexible: false,
    direction: 'vertical',
    hidden: false,
    colorScheme: 'dark',
    onAppear: action('spacer appeared'),
    onDisappear: action('spacer disappeared'),
  },
  argTypes: {
    ...nativeThemeControls,
    size: { control: { type: 'number', min: 0, max: 120 } },
    flexible: { control: 'boolean' },
    direction: { control: 'select', options: ['vertical', 'horizontal'] },
    hidden: { control: 'boolean' },
    style: { control: 'object' },
    modifiers: { control: false },
    onAppear: { control: false },
    onDisappear: { control: false },
  },
  render: (args) => (
    <NativeStoryFrame {...args}>
      <SpacerDemo {...args} />
    </NativeStoryFrame>
  ),
} satisfies Meta<typeof SpacerDemo>;
export default meta;
type Story = StoryObj<typeof meta>;

export const FixedVertical: Story = {};
export const FixedHorizontal: Story = { args: { direction: 'horizontal' } };
export const FlexibleVertical: Story = { args: { flexible: true, size: undefined } };
export const FlexibleHorizontal: Story = {
  args: { direction: 'horizontal', flexible: true, size: undefined },
};
