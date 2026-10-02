import { Column, Row, Text } from '@expo/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { action } from 'storybook/actions';
import { NativeStoryFrame, nativeThemeControls } from '../../components/native-story-frame';
import {
  UniversalScrollView,
  type UniversalScrollViewProps,
} from '@/components/ui/universal-scroll-view';

type DemoProps = UniversalScrollViewProps & {
  itemCount: number;
  onItemPress: (item: number) => void;
};

function ScrollViewDemo({ itemCount, onItemPress, ...args }: DemoProps) {
  const Container = args.direction === 'horizontal' ? Row : Column;
  return (
    <UniversalScrollView {...args}>
      <Container spacing={12} style={{ padding: 12 }} testID={`${args.testID}-content`}>
        {Array.from({ length: itemCount }, (_, i) => (
          <Text
            key={i}
            testID={`${args.testID}-item-${i + 1}`}
            onPress={args.disabled ? undefined : () => onItemPress(i + 1)}
            style={{
              width: 220,
              height: 72,
              padding: 16,
              borderRadius: 12,
              backgroundColor: '#173C65',
            }}
            textStyle={{ fontSize: 16, color: '#DBEDF4' }}
          >{`Item ${i + 1}`}</Text>
        ))}
      </Container>
    </UniversalScrollView>
  );
}

const meta = {
  title: 'Expo UI/Universal Scroll View',
  component: ScrollViewDemo,
  args: {
    testID: 'expo-ui-scroll-view',
    direction: 'vertical',
    showsIndicators: true,
    viewportHeight: 320,
    itemCount: 12,
    disabled: false,
    hidden: false,
    colorScheme: 'dark',
    onItemPress: action('scroll item pressed'),
    onAppear: action('scroll view appeared'),
    onDisappear: action('scroll view disappeared'),
  },
  argTypes: {
    ...nativeThemeControls,
    direction: { control: 'select', options: ['vertical', 'horizontal'] },
    showsIndicators: {
      control: 'boolean',
      description: 'Native indicator visibility is iOS-only.',
    },
    viewportHeight: { control: { type: 'number', min: 150, max: 600 } },
    itemCount: { control: { type: 'number', min: 0, max: 30, step: 1 } },
    disabled: {
      control: 'boolean',
      description: 'Disables item actions; native scrolling may remain available.',
    },
    hidden: { control: 'boolean' },
    children: { control: false },
    modifiers: { control: false },
    onItemPress: { control: false },
    onAppear: { control: false },
    onDisappear: { control: false },
  },
  render: (args) => (
    <NativeStoryFrame {...args}>
      <ScrollViewDemo {...args} />
    </NativeStoryFrame>
  ),
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ScrollViewDemo>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Vertical: Story = {};
export const Horizontal: Story = { args: { direction: 'horizontal', viewportHeight: 140 } };
export const WithoutIndicators: Story = { args: { showsIndicators: false } };
export const ShortContent: Story = { args: { itemCount: 2 } };
export const Empty: Story = { args: { itemCount: 0 } };
export const ManyItems: Story = { args: { itemCount: 30 } };
export const DisabledActions: Story = { args: { disabled: true } };
export const Hidden: Story = { args: { hidden: true } };
export const LightTheme: Story = { args: { colorScheme: 'light' } };
export const DarkTheme: Story = { args: { colorScheme: 'dark' } };
