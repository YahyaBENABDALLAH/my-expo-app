import {
  Column,
  UniversalButton,
  UniversalButtonContent,
  UniversalTextContent,
  UniversalHost,
  authButtonPalettes,
} from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { useState } from 'react';

import { action } from 'storybook/actions';

import Colors from '@/constants/colors';

const meta = {
  title: 'Expo UI/Universal Button',
  component: UniversalButton,
  args: {
    testID: 'expo-ui-button',
    label: 'Continue',
    variant: 'primary',
    colorScheme: 'dark',
    disabled: false,
    onPress: action('button pressed'),
  },
  argTypes: {
    testID: { control: 'text' },
    label: { control: 'text' },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'link', 'success', 'warning', 'destructive'],
    },
    fullWidth: { control: 'boolean' },
    colorScheme: { control: 'select', options: ['light', 'dark'] },
    disabled: { control: 'boolean' },
    onPress: { action: 'pressed' },
  },
  render: (args) => (
    <View
      testID={`${args.testID}-canvas`}
      style={{
        flex: 1,
        backgroundColor: Colors[args.colorScheme ?? 'dark'].background,
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
  args: { label: 'Save changes', variant: 'success' },
};

export const Warning: Story = {
  args: { label: 'Review warning', variant: 'warning' },
};

export const Destructive: Story = {
  args: { label: 'Delete item', variant: 'destructive' },
};

export const FullWidth: Story = { args: { fullWidth: true } };

export const AuthLightPalette: Story = {
  args: { colorScheme: 'light', palette: authButtonPalettes.light, fullWidth: true },
};
export const AuthDarkPalette: Story = {
  args: { colorScheme: 'dark', palette: authButtonPalettes.dark, fullWidth: true },
};

function InteractionDemo() {
  const [presses, setPresses] = useState(0);
  return (
    <UniversalHost colorScheme="dark">
      <Column spacing={16}>
        <UniversalButtonContent
          variant="primary"
          label="Count press"
          testID="button-count"
          onPress={() => setPresses((value) => value + 1)}
        />
        <UniversalButtonContent
          variant="secondary"
          label="Disabled press"
          testID="button-disabled"
          disabled
          onPress={() => setPresses((value) => value + 1)}
        />
        <UniversalTextContent testID="button-press-count">{`Presses: ${presses}`}</UniversalTextContent>
        <UniversalButtonContent
          variant="link"
          label="Reset count"
          testID="button-reset"
          onPress={() => setPresses(0)}
        />
      </Column>
    </UniversalHost>
  );
}

export const Interaction: Story = { render: () => <InteractionDemo /> };
