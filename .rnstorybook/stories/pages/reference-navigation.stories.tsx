import {
  Column,
  Row,
  Spacer,
  Text,
  UniversalButtonContent,
  type FloatingActionKind,
  type NavigationTabName,
  UniversalHost,
  ReferenceNavigationBar,
  nativeFillWidth,
  nativeRowWeight,
} from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { View } from 'react-native';

import { useThemeColors } from '@/hooks/use-theme';

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
  pageContent,
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
  pageContent: boolean;
}) {
  const colors = useThemeColors(colorScheme);
  const [selected, setSelected] = useState(initialSelected);
  const [presses, setPresses] = useState(0);
  const [pagePresses, setPagePresses] = useState(0);
  const actionKind = contextual ? contextKinds[selected] : kind;
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: colors.background,
        width,
        alignSelf: width ? 'center' : 'stretch',
      }}
    >
      <View
        testID="navigation-story-page"
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          backgroundColor: pageContent ? colors.surfaceRaised : undefined,
        }}
      >
        <UniversalHost colorScheme={colorScheme} style={{ marginBottom: 40 }}>
          <Column spacing={8}>
            <Text testID="navigation-story-state">{`Selected: ${selected}; action presses: ${presses}`}</Text>
            <Text testID="navigation-story-action">{actionLabels[actionKind]}</Text>
          </Column>
        </UniversalHost>
        {pageContent ? (
          <UniversalHost
            colorScheme={colorScheme}
            matchContents={false}
            ignoreSafeArea="all"
            style={{ height: 56 }}
          >
            <Row alignment="center" modifiers={nativeFillWidth} style={{ height: 56 }}>
              <Column modifiers={nativeRowWeight}>
                <UniversalButtonContent
                  variant="link"
                  testID="navigation-story-page-action"
                  onPress={() => setPagePresses((count) => count + 1)}
                >
                  {`Page presses: ${pagePresses}`}
                </UniversalButtonContent>
              </Column>
              <Spacer size={84} />
              <Column modifiers={nativeRowWeight}>
                <Text>Page content</Text>
              </Column>
            </Row>
          </UniversalHost>
        ) : null}
      </View>
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
    pageContent: false,
  },
  argTypes: {
    animate: { control: 'boolean' },
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
export const Disabled: Story = { args: { disabled: true } };
export const Static: Story = { args: { animate: false } };

export const ContextSwitching: Story = { args: { contextual: true } };
export const DockFeedback: Story = {
  args: { animate: false, contextual: true },
  parameters: {
    docs: {
      description: {
        story:
          'Hold Home and More to inspect feedback at the screen edges. Tap the upper and lower edges of the raised action; change the colorScheme control to inspect both themes.',
      },
    },
  },
};
export const PageOverlap: Story = {
  args: { pageContent: true, animate: false },
  parameters: {
    docs: {
      description: {
        story:
          'Page content reaches the dock with rounded top corners. The action overlaps only the center; tap the lower edge of Page presses to verify the transparent area beside it passes touches to the page.',
      },
    },
  },
};
export const SafeArea: Story = {
  args: { bottomInset: 34, animate: false },
  parameters: {
    docs: {
      description: {
        story:
          'The 56-point tab row sits above one 34-point home-indicator inset, with no extra bottom spacing. Inspect the rounded top corners in light and dark modes; set bottomInset to 0 to compare a device without a home indicator. This JS fixture does not emulate native safe areas.',
      },
    },
  },
};
