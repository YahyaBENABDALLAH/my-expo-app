import { UniversalText } from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { NativeStoryFrame } from '../../components/native-story-frame';

const meta = {
  title: 'Components/Text',
  component: UniversalText,
  args: {
    testID: 'expo-ui-text',
    children: 'Make every word count',
    variant: 'heading',
    colorScheme: 'dark',
  },
  argTypes: {
    children: { control: 'text' },
    variant: { control: 'select', options: [undefined, 'heading', 'title', 'body', 'caption'] },
    fontWeight: {
      control: 'select',
      options: ['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
    },
    fontSize: { control: { type: 'number', min: 10, max: 72, step: 1 } },
    lightColor: { control: 'color' },
    darkColor: { control: 'color' },
  },
  render: (args) => (
    <NativeStoryFrame colorScheme={args.colorScheme} testID={args.testID}>
      <UniversalText {...args} />
    </NativeStoryFrame>
  ),
} satisfies Meta<typeof UniversalText>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Body: Story = {
  args: { children: 'A clear sentence that is easy to read on any screen.', variant: 'body' },
};
