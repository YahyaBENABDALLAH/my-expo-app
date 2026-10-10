import Colors from '@/constants/colors';
import { UniversalText as RNText } from '@components/ui';
import {
  UniversalCheckbox,
  type UniversalCheckboxProps,
} from '../../components/showcase/universal-checkbox';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { View } from 'react-native';

import { action } from 'storybook/actions';
import { NativeStoryFrame, nativeThemeControls } from '../../components/native-story-frame';

function CheckboxDemo(args: UniversalCheckboxProps) {
  const [value, setValue] = useState(args.value);
  return (
    <View style={{ gap: 16 }}>
      <UniversalCheckbox
        {...args}
        value={value}
        onValueChange={(next) => {
          setValue(next);
          args.onValueChange(next);
        }}
      />
      <RNText
        testID={`${args.testID}-value`}
        textStyle={{ color: args.colorScheme === 'light' ? Colors.light.text : Colors.dark.text }}
      >
        {`Value: ${value ? 'Checked' : 'Unchecked'}`}
      </RNText>
      <RNText
        textStyle={{ color: args.colorScheme === 'light' ? Colors.light.muted : Colors.dark.muted }}
      >
        Android uses a checkbox. iOS uses its native toggle appearance.
      </RNText>
    </View>
  );
}

const meta = {
  title: 'Expo UI/Universal Checkbox',
  component: UniversalCheckbox,
  args: {
    testID: 'expo-ui-checkbox',
    value: false,
    label: 'Accept terms and conditions',
    disabled: false,
    colorScheme: 'dark',
    onValueChange: action('checkbox changed'),
  },
  argTypes: {
    ...nativeThemeControls,
    value: { control: 'boolean' },
    label: { control: 'text' },
    disabled: { control: 'boolean' },
    onValueChange: { control: false },
    modifiers: { control: false },
  },
  render: (args) => (
    <NativeStoryFrame {...args}>
      <CheckboxDemo key={String(args.value)} {...args} />
    </NativeStoryFrame>
  ),
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof UniversalCheckbox>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Unchecked: Story = {};
export const Checked: Story = { args: { value: true } };
export const DisabledUnchecked: Story = { args: { disabled: true } };
export const DisabledChecked: Story = { args: { disabled: true, value: true } };
export const WithoutLabel: Story = { args: { label: undefined } };
export const LongLabel: Story = {
  args: { label: 'I agree to receive updates about my account, notifications, and new features' },
};
export const CustomTint: Story = { args: { seedColor: Colors.dark.primary, value: true } };
export const LightTheme: Story = { args: { colorScheme: 'light' } };
export const DarkTheme: Story = { args: { colorScheme: 'dark' } };
