import Colors from '@/constants/colors';
import { UniversalText } from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';

const meta = {
  title: 'Expo UI/Universal Text',
  component: UniversalText,
  args: {
    testID: 'expo-ui-text',
    children: 'Make every word count',
    variant: 'heading',
    colorScheme: 'dark',
    lightColor: Colors.light.text,
    darkColor: Colors.dark.text,
  },
  argTypes: {
    testID: { control: 'text' },
    children: { control: 'text' },
    variant: { control: 'select', options: [undefined, 'heading', 'title', 'body', 'caption'] },
    fontWeight: {
      control: 'select',
      options: ['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
    },
    fontSize: { control: { type: 'number', min: 10, max: 72, step: 1 } },
    colorScheme: { control: 'select', options: ['light', 'dark'] },
    lightColor: { control: 'color' },
    darkColor: { control: 'color' },
  },
  render: (args) => (
    <View
      testID={`${args.testID}-canvas`}
      style={{
        flex: 1,
        backgroundColor:
          args.colorScheme === 'dark' ? Colors.dark.background : Colors.light.background,
        padding: 24,
      }}
    >
      <UniversalText {...args} />
    </View>
  ),
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof UniversalText>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Heading: Story = {};

export const Title: Story = {
  args: { children: 'A thoughtful title', variant: 'title' },
};

export const Body: Story = {
  args: { children: 'A clear sentence that is easy to read on any screen.', variant: 'body' },
};

export const Caption: Story = {
  args: { children: 'Supporting details', variant: 'caption' },
};

export const LightTheme: Story = {
  args: { children: 'Light appearance', colorScheme: 'light' },
};

export const DarkTheme: Story = {
  args: { children: 'Dark appearance', colorScheme: 'dark' },
};

export const CustomWeightAndSize: Story = {
  args: { children: 'A lighter title', variant: 'title', fontWeight: '300', fontSize: 30 },
};

export const NativeDefault: Story = {
  args: { variant: undefined, children: 'Native typography with the shared theme' },
};
