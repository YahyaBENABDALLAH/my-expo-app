import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { action } from 'storybook/actions';
import { NativeStoryFrame, nativeThemeControls } from '../../components/native-story-frame';
import { UniversalCheckbox, type UniversalCheckboxProps } from '@/components/ui/universal-checkbox';

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
      <Text
        testID={`${args.testID}-value`}
        style={{ color: args.colorScheme === 'light' ? '#173C65' : '#DBEDF4' }}
      >
        Value: {value ? 'Checked' : 'Unchecked'}
      </Text>
      <Text style={{ color: args.colorScheme === 'light' ? '#526C82' : '#98AEC2' }}>
        Android uses a checkbox. iOS uses its native toggle appearance.
      </Text>
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
    seedColor: '#5AB9E8',
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
export const CustomTint: Story = { args: { seedColor: '#39B58D', value: true } };
export const LightTheme: Story = { args: { colorScheme: 'light' } };
export const DarkTheme: Story = { args: { colorScheme: 'dark' } };
