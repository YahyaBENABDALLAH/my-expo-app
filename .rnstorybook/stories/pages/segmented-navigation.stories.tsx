import { Column, Text, SegmentedControl, UniversalHost } from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { View } from 'react-native';

const mainDestinations = [
  { value: 'index', label: 'Home', testID: 'segment-home' },
  { value: 'search', label: 'Search', testID: 'segment-search' },
  { value: 'recipes', label: 'Recipes', testID: 'segment-recipes' },
  { value: 'more', label: 'More', testID: 'segment-more' },
];

function SegmentedNavigationDemo({ colorScheme }: { colorScheme: 'light' | 'dark' }) {
  const [selected, setSelected] = useState('index');
  return (
    <View style={{ paddingHorizontal: 8 }}>
      <UniversalHost colorScheme={colorScheme}>
        <Column spacing={16}>
          <SegmentedControl
            options={mainDestinations}
            selectedValue={selected}
            onValueChange={setSelected}
          />
          <Text testID="segment-selection">{`Selected: ${selected}`}</Text>
        </Column>
      </UniversalHost>
    </View>
  );
}

const meta = {
  title: 'Pages/Segmented navigation',
  component: SegmentedNavigationDemo,
  args: { colorScheme: 'light' },
  argTypes: { colorScheme: { control: 'select', options: ['light', 'dark'] } },
} satisfies Meta<typeof SegmentedNavigationDemo>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Light: Story = {};
export const Dark: Story = { args: { colorScheme: 'dark' } };
