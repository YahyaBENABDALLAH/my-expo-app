import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { action } from 'storybook/actions';

import { UniversalButton } from '@/components/ui/universal-button';

const meta = {
  title: 'Expo UI/Universal Button',
  component: UniversalButton,
  args: {
    testID: 'expo-ui-button',
    label: 'Continue',
    variant: 'primary',
    semanticVariant: 'primary',
    size: 'regular',
    rounded: false,
    colorScheme: 'dark',
    disabled: false,
    onPress: action('button pressed'),
  },
  argTypes: {
    testID: { control: 'text' },
    label: { control: 'text' },
    variant: { control: 'select', options: ['primary', 'secondary', 'link'] },
    semanticVariant: {
      control: 'select',
      options: ['primary', 'success', 'warning', 'destructive'],
    },
    size: { control: 'select', options: ['compact', 'regular', 'large'] },
    rounded: { control: 'boolean' },
    colorScheme: { control: 'select', options: ['light', 'dark'] },
    disabled: { control: 'boolean' },
    onPress: { action: 'pressed' },
  },
  render: (args) => (
    <View
      testID={`${args.testID}-canvas`}
      style={{
        flex: 1,
        backgroundColor: args.colorScheme === 'dark' ? '#081224' : '#F4F8FC',
        padding: 24,
      }}
    >
      <UniversalButton {...args} />
    </View>
  ),
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof UniversalButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: { label: 'Learn more', variant: 'secondary' },
};

export const Link: Story = {
  args: { label: 'Skip for now', variant: 'link' },
};

export const LightTheme: Story = {
  args: { label: 'Continue', colorScheme: 'light' },
};

export const DarkTheme: Story = {
  args: { label: 'Continue', colorScheme: 'dark' },
};

export const Disabled: Story = {
  args: { label: 'Unavailable', disabled: true },
};

export const Success: Story = {
  args: { label: 'Save changes', semanticVariant: 'success' },
};

export const Warning: Story = {
  args: { label: 'Review warning', semanticVariant: 'warning' },
};

export const Destructive: Story = {
  args: { label: 'Delete item', semanticVariant: 'destructive' },
};

export const RoundedCompact: Story = {
  args: { label: 'Add', rounded: true, size: 'compact' },
};

export const RoundedLarge: Story = {
  args: { label: 'Get started', rounded: true, size: 'large' },
};
