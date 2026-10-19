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
      <Text testID={`${args.testID}-value`}>
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
  title: 'Components/Slider',
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
} satisfies Meta<typeof UniversalSlider>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Continuous: Story = {};
