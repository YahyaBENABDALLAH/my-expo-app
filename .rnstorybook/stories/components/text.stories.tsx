import { UniversalText } from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { NativeStoryFrame } from '../../components/native-story-frame';
import TextScreen from '@/features/ui-showcase/text-screen';

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
    variant: {
      control: 'select',
      options: [undefined, 'heading', 'title', 'subtitle', 'body', 'label', 'caption'],
    },
    tone: {
      control: 'select',
      options: ['default', 'muted', 'primary', 'secondary', 'success', 'warning', 'error', 'info'],
    },
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

export const Heading: Story = {};
export const Title: Story = { args: { variant: 'title', children: 'Your favorite recipes' } };
export const Subtitle: Story = {
  args: { variant: 'subtitle', children: 'Fresh ideas for every day' },
};
export const Body: Story = {
  args: { children: 'A clear sentence that is easy to read on any screen.', variant: 'body' },
};
export const Label: Story = { args: { variant: 'label', children: 'Recipe name' } };
export const Caption: Story = {
  args: { variant: 'caption', children: 'Updated a few minutes ago' },
};
export const Muted: Story = {
  args: { variant: 'body', tone: 'muted', children: 'Optional details appear here.' },
};
export const Primary: Story = {
  args: { variant: 'body', tone: 'primary', children: 'Featured recipe' },
};
export const Secondary: Story = {
  args: { variant: 'body', tone: 'secondary', children: 'More recipes to explore' },
};
export const Success: Story = {
  args: { variant: 'body', tone: 'success', children: 'Your recipe was saved.' },
};
export const Warning: Story = {
  args: { variant: 'body', tone: 'warning', children: 'You have unsaved changes.' },
};
export const Error: Story = {
  args: { variant: 'body', tone: 'error', children: 'Unable to save. Please try again.' },
};
export const Info: Story = {
  args: { variant: 'body', tone: 'info', children: 'Your draft is available offline.' },
};

export const ThemeComparison: Story = {
  render: () => <TextScreen />,
  parameters: {
    docs: {
      description: {
        story:
          'Change the local palette and appearance; compare all text tones on three page surfaces, explicit overrides and the filled primary button. The action count survives changes and saved app preferences stay untouched.',
      },
    },
  },
};
