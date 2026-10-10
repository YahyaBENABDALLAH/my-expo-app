import {
  Column,
  UniversalButtonContent,
  FloatingAction,
  RecipeStepper,
  UniversalHost,
  UniversalTextContent as Text,
} from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { View } from 'react-native';

import Colors from '@/constants/colors';

function ReferenceMotionDemo({
  animate,
  colorScheme,
}: {
  animate: boolean;
  colorScheme: 'light' | 'dark';
}) {
  const [current, setCurrent] = useState(0);
  const [presses, setPresses] = useState(0);
  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: Colors[colorScheme].background }}>
      <FloatingAction
        kind="create"
        label="Create recipe"
        colorScheme={colorScheme}
        animate={animate}
        onPress={() => setPresses(presses + 1)}
      />
      <UniversalHost colorScheme={colorScheme}>
        <Column spacing={12}>
          <Text
            colorScheme={colorScheme}
            testID="floating-action-count"
          >{`Action presses: ${presses}`}</Text>
          <RecipeStepper current={current} animate={animate} colorScheme={colorScheme} />
          <UniversalButtonContent
            variant="secondary"
            label="Next step"
            testID="story-next-step"
            onPress={() => setCurrent((current + 1) % 4)}
          />
        </Column>
      </UniversalHost>
    </View>
  );
}
const meta = {
  title: 'Pages/Reference motion',
  component: ReferenceMotionDemo,
  args: { animate: true, colorScheme: 'light' },
  argTypes: {
    animate: { control: 'boolean' },
    colorScheme: { control: 'select', options: ['light', 'dark'] },
  },
} satisfies Meta<typeof ReferenceMotionDemo>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Light: Story = {};
export const Dark: Story = { args: { colorScheme: 'dark' } };
export const Static: Story = { args: { animate: false } };
