import Colors from '@/constants/colors';
import { UniversalText as Text, UniversalButton } from '@components/ui';
import {
  UniversalPicker,
  type UniversalPickerProps,
} from '../../components/showcase/universal-picker';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { View } from 'react-native';

import { action } from 'storybook/actions';
import { NativeStoryFrame, nativeThemeControls } from '../../components/native-story-frame';

const cities = [
  { label: 'Casablanca', value: 'casablanca' },
  { label: 'Rabat', value: 'rabat' },
  { label: 'Marrakech', value: 'marrakech' },
];

function PickerDemo(args: UniversalPickerProps) {
  const [selectedValue, setSelectedValue] = useState(args.selectedValue);
  return (
    <View style={{ gap: 16 }}>
      <UniversalPicker
        {...args}
        selectedValue={selectedValue}
        onValueChange={(next) => {
          setSelectedValue(next);
          args.onValueChange(next);
        }}
      />
      <Text
        testID={`${args.testID}-value`}
        textStyle={{ color: args.colorScheme === 'light' ? Colors.light.text : Colors.dark.text }}
      >
        {`Selected: ${String(selectedValue)}`}
      </Text>
      <UniversalButton
        variant="secondary"
        label="Reset selection"
        testID={`${args.testID}-reset`}
        colorScheme={args.colorScheme}
        disabled={!args.enabled}
        onPress={() => setSelectedValue(args.selectedValue)}
      />
      {args.appearance === 'wheel' ? (
        <Text
          textStyle={{
            color: args.colorScheme === 'light' ? Colors.light.muted : Colors.dark.muted,
          }}
        >
          Wheel appearance is iOS-only. Android uses its native dropdown.
        </Text>
      ) : null}
    </View>
  );
}

const meta = {
  title: 'Expo UI/Universal Picker',
  component: UniversalPicker,
  args: {
    testID: 'expo-ui-picker',
    selectedValue: 'casablanca',
    options: cities,
    appearance: 'menu',
    enabled: true,
    colorScheme: 'dark',
    onValueChange: action('picker changed'),
  },
  argTypes: {
    ...nativeThemeControls,
    selectedValue: { control: 'object', description: 'Must match one of the option values.' },
    options: { control: 'object' },
    appearance: { control: 'select', options: ['menu', 'wheel'] },
    enabled: { control: 'boolean' },
    onValueChange: { control: false },
  },
  render: (args) => (
    <NativeStoryFrame {...args}>
      <PickerDemo
        key={`${typeof args.selectedValue}:${args.selectedValue}:${JSON.stringify(args.options)}`}
        {...args}
      />
    </NativeStoryFrame>
  ),
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof UniversalPicker>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Menu: Story = {};
export const Wheel: Story = { args: { appearance: 'wheel' } };
export const Disabled: Story = { args: { enabled: false } };
export const NumericValues: Story = {
  args: {
    selectedValue: 2,
    options: [
      { label: 'One', value: 1 },
      { label: 'Two', value: 2 },
      { label: 'Three', value: 3 },
    ],
  },
};
export const LightTheme: Story = { args: { colorScheme: 'light' } };
