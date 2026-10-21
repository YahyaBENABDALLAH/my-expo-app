import {
  Column,
  nativeFillWidth,
  PageFrame,
  PageSection,
  PageMotionOverlay,
  ScrollView,
  UniversalHost,
  UniversalButtonContent,
  UniversalTextContent as Text,
  usePageHeaderInset,
} from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaInsetsContext, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/hooks/use-theme';
import { LayoutDirectionProvider } from '@/context/layout-direction.context';
import { spacing, radii } from '@/constants/layout';
import { DEFAULT_HEADER_SHAPE, HEADER_SHAPES } from '@/constants/header-motion';

function HeaderContent({
  colorScheme,
  presses,
  onNavigate,
}: {
  colorScheme?: 'light' | 'dark';
  presses: number;
  onNavigate?: () => void;
}) {
  const colors = useThemeColors(colorScheme);
  const headerInset = usePageHeaderInset();
  const insets = useSafeAreaInsets();
  const [contentPresses, setContentPresses] = useState(0);
  return (
    <UniversalHost
      colorScheme={colorScheme}
      matchContents={false}
      ignoreSafeArea="all"
      style={{ flex: 1 }}
    >
      <ScrollView testID="page-header-scroll">
        <Column
          spacing={0}
          modifiers={nativeFillWidth}
          style={{ padding: 0, paddingTop: headerInset + insets.top }}
        >
          <PageSection>
            {onNavigate ? (
              <UniversalButtonContent
                variant="secondary"
                label="Open details"
                testID="page-header-open-details"
                onPress={onNavigate}
              />
            ) : null}
            <UniversalButtonContent
              variant="secondary"
              label="Content action"
              testID="page-header-content-action"
              onPress={() => setContentPresses((value) => value + 1)}
            />
            <Text testID="page-header-content-count">{`Content presses: ${contentPresses}`}</Text>
            <Text testID="page-header-back-count">{`Back presses: ${presses}`}</Text>
          </PageSection>
          {Array.from({ length: 20 }, (_, index) => (
            <PageSection key={index}>
              <Column
                spacing={spacing.sm}
                modifiers={nativeFillWidth}
                style={{
                  padding: spacing.lg,
                  borderRadius: radii.card,
                  backgroundColor: index % 2 ? colors.surface : colors.selection,
                }}
              >
                <Text variant="title">{`Recipe ${index + 1}`}</Text>
                <Text>Scroll to inspect the shared header blur.</Text>
              </Column>
            </PageSection>
          ))}
        </Column>
      </ScrollView>
    </UniversalHost>
  );
}

function HeaderDemo({
  showBack = true,
  shape: _shape,
  ...props
}: Parameters<typeof PageFrame>[0] & {
  showBack?: boolean;
  shape?: Parameters<typeof PageMotionOverlay>[0]['shape'];
}) {
  const [presses, setPresses] = useState(0);
  return (
    <PageFrame {...props} onBack={showBack ? () => setPresses((value) => value + 1) : undefined}>
      <HeaderContent colorScheme={props.colorScheme} presses={presses} />
    </PageFrame>
  );
}

const meta = {
  title: 'Components/Page Header',
  component: HeaderDemo,
  args: {
    title: 'Settings',
    colorScheme: 'light',
    scrollsBehindHeader: false,
    showBack: true,
    shape: DEFAULT_HEADER_SHAPE,
  },
  argTypes: {
    showBack: { control: 'boolean' },
    shape: {
      control: 'select',
      options: HEADER_SHAPES,
      description: 'Header contour, shared by the artwork and native blur mask.',
    },
  },
  decorators: [
    (Story, { args, parameters }) => {
      const colors = useThemeColors(args.colorScheme);
      return (
        <LayoutDirectionProvider initialDirection={parameters.waveDirection ?? 'ltr'}>
          <SafeAreaInsetsContext.Provider value={{ top: 59, bottom: 34, left: 0, right: 0 }}>
            <View style={{ flex: 1, backgroundColor: colors.background }}>
              <PageMotionOverlay
                colorScheme={args.colorScheme}
                shape={args.shape}
                animate={parameters.animateWaves !== false}
                visible={!parameters.withoutWaves}
                expanded={Boolean(parameters.expandedWaves)}
              >
                <Story />
              </PageMotionOverlay>
            </View>
          </SafeAreaInsetsContext.Provider>
        </LayoutDirectionProvider>
      );
    },
  ],
  render: (args) => <HeaderDemo {...args} />,
} satisfies Meta<typeof HeaderDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Home: Story = {
  args: { title: 'Accueil', showBack: false, scrollsBehindHeader: true },
};

function NavigationHeaderDemo({ colorScheme }: { colorScheme?: 'light' | 'dark' }) {
  const [details, setDetails] = useState(false);
  const [returns, setReturns] = useState(0);
  return (
    <PageFrame
      key={details ? 'details' : 'home'}
      title={details ? 'Details' : 'Accueil'}
      colorScheme={colorScheme}
      scrollsBehindHeader
      onBack={
        details
          ? () => {
              setReturns((value) => value + 1);
              setDetails(false);
            }
          : undefined
      }
    >
      <HeaderContent
        colorScheme={colorScheme}
        presses={returns}
        onNavigate={details ? undefined : () => setDetails(true)}
      />
    </PageFrame>
  );
}

export const NavigationContinuity: Story = {
  render: ({ colorScheme }) => <NavigationHeaderDemo colorScheme={colorScheme} />,
  parameters: {
    animateWaves: false,
    docs: {
      description: {
        story:
          'Open details and use Back repeatedly. Each page remounts beneath the same paused wave; the header band and initial content clearance should stay at the same height.',
      },
    },
  },
};
export const Dark: Story = { args: { colorScheme: 'dark' } };
export const Scrolling: Story = { args: { title: 'Saved recipes', scrollsBehindHeader: true } };
export const LongTitle: Story = {
  args: { title: 'Toutes les pages et les paramètres de l’application', scrollsBehindHeader: true },
  parameters: { animateWaves: true },
};
export const FullHeightOverlay: Story = { args: { title: 'Overlay', headerOverlay: true } };
export const WithoutWaves: Story = { parameters: { withoutWaves: true } };
export const ExpandedLogin: Story = {
  args: { title: 'Login', showBack: false },
  parameters: { expandedWaves: true },
};
