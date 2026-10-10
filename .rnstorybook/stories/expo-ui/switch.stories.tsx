import Colors from '@/constants/colors';
import { UniversalText as Text, UniversalButton } from '@components/ui';
import {
  UniversalSwitch,
  type UniversalSwitchProps,
} from '../../components/showcase/universal-switch';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { View } from 'react-native';

import { action } from 'storybook/actions';
import { NativeStoryFrame, nativeThemeControls } from '../../components/native-story-frame';

function SwitchDemo(args: UniversalSwitchProps) {
  const [value, setValue] = useState(args.value);
  return (
    <View style={{ gap: 16 }}>
      <UniversalSwitch
        {...args}
        value={value}
        onValueChange={(next) => {
          setValue(next);
          args.onValueChange(next);
        }}
      />
      <Text
        testID={`${args.testID}-value`}
        textStyle={{ color: args.colorScheme === 'light' ? Colors.light.text : Colors.dark.text }}
      >
        {`Value: ${value ? 'On' : 'Off'}`}
      </Text>
      <UniversalButton
        variant="secondary"
        testID={`${args.testID}-reset`}
        label="Reset switch"
        colorScheme={args.colorScheme}
        disabled={args.disabled}
        onPress={() => {
          setValue(args.value);
          action('reset switch pressed')();
        }}
      />
    </View>
  );
}

const meta = {
  title: 'Expo UI/Universal Switch',
  component: UniversalSwitch,
  args: {
    testID: 'expo-ui-switch',
    value: false,
    label: 'Enable notifications',
    disabled: false,
    colorScheme: 'dark',
    onValueChange: action('switch changed'),
  },
  argTypes: {
    ...nativeThemeControls,
    seedColor: { control: false, description: 'Switch colors use shared theme tokens.' },
    value: { control: 'boolean' },
    label: { control: 'text' },
    disabled: { control: 'boolean' },
    onValueChange: { control: false },
    modifiers: { control: false },
  },
  render: (args) => (
    <NativeStoryFrame {...args}>
      <SwitchDemo key={String(args.value)} {...args} />
    </NativeStoryFrame>
  ),
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof UniversalSwitch>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Off: Story = {};
export const On: Story = { args: { value: true } };
export const DisabledOff: Story = { args: { disabled: true } };
export const DisabledOn: Story = { args: { disabled: true, value: true } };
export const WithoutLabel: Story = { args: { label: undefined } };
export const LongLabel: Story = {
  args: { label: 'Receive notifications about activity and updates to your account' },
};
export const LightTheme: Story = { args: { colorScheme: 'light' } };
export const DarkTheme: Story = { args: { colorScheme: 'dark' } };
export const TokenColors: Story = { args: { value: true, label: 'Shared green switch tokens' } };
