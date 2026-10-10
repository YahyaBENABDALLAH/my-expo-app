import Colors from '@/constants/colors';
import { UniversalText as Text, UniversalButton } from '@components/ui';
import {
  UniversalSlider,
  type UniversalSliderProps,
} from '../../components/showcase/universal-slider';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { View } from 'react-native';

import { action } from 'storybook/actions';
import { NativeStoryFrame, nativeThemeControls } from '../../components/native-story-frame';

function SliderDemo(args: UniversalSliderProps) {
  const [value, setValue] = useState(args.value);
  return (
    <View style={{ gap: 16 }}>
      <Text
        testID={`${args.testID}-value`}
        textStyle={{ color: args.colorScheme === 'light' ? Colors.light.text : Colors.dark.text }}
      >
        {`Value: ${Number(value.toFixed(2))} · Range: ${args.min}–${args.max}`}
      </Text>
      <UniversalSlider
        {...args}
        value={value}
        onValueChange={(next) => {
          setValue(next);
          args.onValueChange(next);
        }}
      />
      <UniversalButton
        variant="secondary"
        testID={`${args.testID}-reset`}
        label="Reset slider"
        colorScheme={args.colorScheme}
        disabled={args.disabled}
        onPress={() => {
          setValue(args.value);
          action('reset slider pressed')();
        }}
      />
    </View>
  );
}

const meta = {
  title: 'Expo UI/Universal Slider',
  component: UniversalSlider,
  args: {
    testID: 'expo-ui-slider',
    value: 50,
    min: 0,
    max: 100,
    disabled: false,
    colorScheme: 'dark',
    onValueChange: action('slider changed'),
  },
  argTypes: {
    ...nativeThemeControls,
    value: { control: 'number' },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    disabled: { control: 'boolean' },
    onValueChange: { control: false },
    modifiers: { control: false },
  },
  render: (args) => (
    <NativeStoryFrame {...args}>
      <SliderDemo key={`${args.value}-${args.min}-${args.max}-${args.step}`} {...args} />
    </NativeStoryFrame>
  ),
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof UniversalSlider>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Continuous: Story = {};
export const Minimum: Story = { args: { value: 0 } };
export const Maximum: Story = { args: { value: 100 } };
export const Stepped: Story = { args: { step: 10 } };
export const FineSteps: Story = { args: { min: 0, max: 1, value: 0.5, step: 0.1 } };
export const NegativeRange: Story = { args: { min: -50, max: 50, value: 0, step: 5 } };
export const Disabled: Story = { args: { disabled: true } };
export const DisabledMinimum: Story = { args: { disabled: true, value: 0 } };
export const DisabledMaximum: Story = { args: { disabled: true, value: 100 } };
export const LightTheme: Story = { args: { colorScheme: 'light' } };
export const DarkTheme: Story = { args: { colorScheme: 'dark' } };
export const CustomTint: Story = { args: { seedColor: Colors.dark.secondary } };
