import {
  Column,
  UniversalButtonContent,
  RecipeStepper,
  UniversalHost,
  UniversalTextContent as Text,
  nativeFillWidth,
} from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { View } from 'react-native';

import Colors from '@/constants/colors';

function RecipeStepperDemo({
  initialStep = 0,
  initiallyValid = false,
  animate = true,
  colorScheme = 'light',
  width,
}: {
  initialStep?: number;
  initiallyValid?: boolean;
  animate?: boolean;
  colorScheme?: 'light' | 'dark';
  width?: number;
}) {
  const [current, setCurrent] = useState(initialStep);
  const [valid, setValid] = useState(initiallyValid);
  const changeStep = (step: number) => {
    setCurrent(step);
    setValid(false);
  };
  return (
    <View style={{ flex: 1, padding: 24, backgroundColor: Colors[colorScheme].background }}>
      <View style={{ width: width ?? '100%', maxWidth: '100%' }}>
        <UniversalHost colorScheme={colorScheme}>
          <Column spacing={16} modifiers={nativeFillWidth}>
            <RecipeStepper
              current={current}
              isCurrentValid={valid}
              animate={animate}
              colorScheme={colorScheme}
            />
            <Text colorScheme={colorScheme} testID="stepper-validity">
              {valid ? 'Current step is valid' : 'Current step is incomplete'}
            </Text>
            <UniversalButtonContent
              variant="secondary"
              label="Toggle validity"
              testID="stepper-toggle-validity"
              onPress={() => setValid(!valid)}
            />
            <UniversalButtonContent
              variant="secondary"
              label="Previous step"
              testID="stepper-previous"
              disabled={current === 0}
              onPress={() => changeStep(current - 1)}
            />
            <UniversalButtonContent
              variant="secondary"
              label="Next step"
              testID="stepper-next"
              disabled={current === 3}
              onPress={() => changeStep(current + 1)}
            />
            <UniversalButtonContent
              variant="secondary"
              label="Reset"
              testID="stepper-reset"
              onPress={() => changeStep(0)}
            />
          </Column>
        </UniversalHost>
      </View>
    </View>
  );
}

const meta = {
  title: 'Pages/Recipe stepper',
  component: RecipeStepperDemo,
  args: { initialStep: 0, initiallyValid: false, animate: true, colorScheme: 'light' },
  argTypes: {
    initialStep: { control: false },
    initiallyValid: { control: false },
    animate: { control: 'boolean' },
    colorScheme: { control: 'select', options: ['light', 'dark'] },
  },
} satisfies Meta<typeof RecipeStepperDemo>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Light: Story = {};
export const Dark: Story = { args: { colorScheme: 'dark' } };
export const ValidStep: Story = { args: { initiallyValid: true } };
export const Details: Story = { args: { initialStep: 1 } };
export const Ingredients: Story = { args: { initialStep: 2 } };
export const FinalStep: Story = { args: { initialStep: 3, initiallyValid: true } };
export const NarrowPhone: Story = { args: { width: 260 } };
export const Static: Story = { args: { animate: false, initialStep: 2, initiallyValid: true } };
