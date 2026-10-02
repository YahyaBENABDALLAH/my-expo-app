import { Column, Host, Row, Text, type SpacerProps } from '@expo/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { action } from 'storybook/actions';
import {
  NativeStoryFrame,
  nativeThemeControls,
  type NativeStoryTheme,
} from '../../components/native-story-frame';
import { UniversalSpacer } from '@/components/ui/universal-spacer';

type DemoProps = SpacerProps & NativeStoryTheme & { direction: 'vertical' | 'horizontal' };

function SpacerDemo({ colorScheme, seedColor, direction, ...args }: DemoProps) {
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
          backgroundColor: colorScheme === 'light' ? '#DDEAF5' : '#101F34',
          borderRadius: 12,
        }}
      >
        <Text
          testID={`${args.testID}-start`}
          style={{ padding: 8, backgroundColor: '#173C65', borderRadius: 8 }}
          textStyle={{ color: '#DBEDF4' }}
        >
          Start
        </Text>
        <UniversalSpacer {...args} />
        <Text
          testID={`${args.testID}-end`}
          style={{ padding: 8, backgroundColor: '#173C65', borderRadius: 8 }}
          textStyle={{ color: '#DBEDF4' }}
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
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof SpacerDemo>;
export default meta;
type Story = StoryObj<typeof meta>;

export const FixedVertical: Story = {};
export const FixedHorizontal: Story = { args: { direction: 'horizontal' } };
export const ZeroSize: Story = { args: { size: 0 } };
export const LargeGap: Story = { args: { size: 80 } };
export const FlexibleVertical: Story = { args: { flexible: true, size: undefined } };
export const FlexibleHorizontal: Story = {
  args: { direction: 'horizontal', flexible: true, size: undefined },
};
export const HighlightedSpace: Story = { args: { style: { backgroundColor: '#39B58D' } } };
export const Hidden: Story = { args: { hidden: true } };
export const LightTheme: Story = { args: { colorScheme: 'light' } };
export const DarkTheme: Story = { args: { colorScheme: 'dark' } };
