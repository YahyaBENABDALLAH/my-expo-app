import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { action } from 'storybook/actions';
import { NativeStoryFrame, nativeThemeControls } from '../../components/native-story-frame';
import { UniversalPicker, type UniversalPickerProps } from '@/components/ui/universal-picker';

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
        style={{ color: args.colorScheme === 'light' ? '#173C65' : '#DBEDF4' }}
      >
        Selected: {String(selectedValue)}
      </Text>
      {args.appearance === 'wheel' ? (
        <Text style={{ color: args.colorScheme === 'light' ? '#526C82' : '#98AEC2' }}>
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
    seedColor: '#5AB9E8',
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
export const SecondSelected: Story = { args: { selectedValue: 'rabat' } };
export const Disabled: Story = { args: { enabled: false } };
export const DisabledWheel: Story = { args: { enabled: false, appearance: 'wheel' } };
export const SingleOption: Story = { args: { options: [cities[0]] } };
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
export const ManyOptions: Story = {
  args: {
    selectedValue: 'item-1',
    options: Array.from({ length: 20 }, (_, i) => ({
      label: `Option ${i + 1}`,
      value: `item-${i + 1}`,
    })),
  },
};
export const LongLabels: Story = {
  args: {
    options: cities.map((city) => ({
      ...city,
      label: `${city.label} — a destination for your next journey`,
    })),
  },
};
export const LightTheme: Story = { args: { colorScheme: 'light' } };
export const DarkTheme: Story = { args: { colorScheme: 'dark' } };
