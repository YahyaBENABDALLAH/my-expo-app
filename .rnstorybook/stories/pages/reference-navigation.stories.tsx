import {
  Column,
  Text,
  type FloatingActionKind,
  FloatingActionButton,
  type NavigationTabName,
  UniversalHost,
  ReferenceNavigationBar,
} from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { View } from 'react-native';

import Colors from '@/constants/colors';

const contextKinds: Record<NavigationTabName | 'create-recipe', FloatingActionKind> = {
  index: 'create',
  search: 'filters',
  recipes: 'liked',
  more: 'profile',
  'create-recipe': 'continue',
};
const actionLabels: Record<FloatingActionKind, string> = {
  create: 'Create recipe',
  continue: 'Continue recipe',
  submit: 'Submit recipe',
  filters: 'Open search filters',
  'active-filters': 'Open active search filters',
  liked: 'Open liked recipes and favorites',
  profile: 'Open profile preferences',
};

function NavigationDemo({
  colorScheme,
  kind,
  disabled,
  animate,
  contextual,
  initialSelected,
  bottomInset,
  leftInset,
  rightInset,
  width,
}: {
  colorScheme: 'light' | 'dark';
  kind: FloatingActionKind;
  disabled: boolean;
  animate: boolean;
  contextual: boolean;
  initialSelected: NavigationTabName | 'create-recipe';
  bottomInset: number;
  leftInset: number;
  rightInset: number;
  width?: number;
}) {
  const [selected, setSelected] = useState(initialSelected);
  const [presses, setPresses] = useState(0);
  const actionKind = contextual ? contextKinds[selected] : kind;
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: Colors[colorScheme].background,
        width,
        alignSelf: width ? 'center' : 'stretch',
      }}
    >
      <UniversalHost colorScheme={colorScheme} style={{ marginBottom: 40 }}>
        <Column spacing={8}>
          <Text testID="navigation-story-state">{`Selected: ${selected}; action presses: ${presses}`}</Text>
          <Text testID="navigation-story-action">{actionLabels[actionKind]}</Text>
        </Column>
      </UniversalHost>
      <ReferenceNavigationBar
        colorScheme={colorScheme}
        selected={selected}
        animate={animate}
        bottomInset={bottomInset}
        leftInset={leftInset}
        rightInset={rightInset}
        onSelect={setSelected}
        action={{
          kind: actionKind,
          disabled,
          label: actionLabels[actionKind],
          onPress: () => setPresses((count) => count + 1),
        }}
      />
    </View>
  );
}
const meta = {
  title: 'Pages/Reference navigation',
  component: NavigationDemo,
  render: (args) => <NavigationDemo key={args.initialSelected} {...args} />,
  args: {
    colorScheme: 'light',
    kind: 'create',
    disabled: false,
    animate: true,
    contextual: false,
    initialSelected: 'index',
    bottomInset: 0,
    leftInset: 0,
    rightInset: 0,
  },
  argTypes: {
    animate: { control: 'boolean' },
    colorScheme: { control: 'select', options: ['light', 'dark'] },
    initialSelected: {
      control: 'select',
      options: ['index', 'search', 'recipes', 'more', 'create-recipe'],
    },
    kind: {
      control: 'select',
      options: ['create', 'continue', 'submit', 'filters', 'active-filters', 'liked', 'profile'],
    },
  },
} satisfies Meta<typeof NavigationDemo>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Light: Story = {};
export const Dark: Story = { args: { colorScheme: 'dark' } };
export const Creating: Story = { args: { kind: 'continue' } };
export const ActiveFilters: Story = { args: { kind: 'active-filters' } };
export const Disabled: Story = { args: { disabled: true } };
export const Static: Story = { args: { animate: false } };

function NativeControlDemo({
  colorScheme,
  kind,
  disabled,
}: {
  colorScheme: 'light' | 'dark';
  kind: FloatingActionKind;
  disabled: boolean;
}) {
  const [presses, setPresses] = useState(0);
  return (
    <UniversalHost colorScheme={colorScheme}>
      <Column spacing={16}>
        <Text testID="native-action-count">{`Native presses: ${presses}`}</Text>
        <FloatingActionButton
          kind={kind}
          label={actionLabels[kind]}
          disabled={disabled}
          onPress={() => setPresses((value) => value + 1)}
        />
      </Column>
    </UniversalHost>
  );
}

export const NativeControl: Story = { render: (args) => <NativeControlDemo {...args} /> };
export const Breathing: Story = {};
export const GlassAndTap: Story = {};
export const DarkGlassAndTap: Story = { args: { colorScheme: 'dark' } };
export const ContextSwitching: Story = { args: { contextual: true } };
export const DockFeedback: Story = {
  args: { animate: false, contextual: true },
  parameters: {
    docs: {
      description: {
        story:
          'Hold Home and More to inspect feedback at the curved dock ends. Tap the upper and lower edges of the raised action; change the colorScheme control to inspect both themes.',
      },
    },
  },
};
export const SafeArea: Story = { args: { bottomInset: 34 } };
export const SideCutouts: Story = { args: { leftInset: 44, rightInset: 20 } };
export const NarrowPhone: Story = { args: { width: 320 } };
export const CreationRoute: Story = {
  args: { initialSelected: 'create-recipe', kind: 'continue' },
};
