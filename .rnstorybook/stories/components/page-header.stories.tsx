import {
  Column,
  nativeFillWidth,
  PageFrame,
  PageSection,
  PageMotionOverlay,
  ScrollView,
  UniversalHost,
  UniversalTextContent as Text,
  usePageHeaderInset,
} from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { useThemeColors } from '@/hooks/use-theme';
import { SettingsPage } from '@/features/settings/settings-screen';
import { LayoutDirectionProvider } from '@/context/layout-direction.context';
import { spacing, radii } from '@/constants/layout';

function HeaderContent({
  colorScheme,
  presses,
}: {
  colorScheme?: 'light' | 'dark';
  presses: number;
}) {
  const colors = useThemeColors(colorScheme);
  const headerInset = usePageHeaderInset();
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
          style={{ padding: 0, paddingTop: headerInset }}
        >
          <PageSection>
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

function HeaderDemo(props: Parameters<typeof PageFrame>[0]) {
  const [presses, setPresses] = useState(0);
  return (
    <PageFrame {...props} onBack={() => setPresses((value) => value + 1)}>
      <HeaderContent colorScheme={props.colorScheme} presses={presses} />
    </PageFrame>
  );
}

const meta = {
  title: 'Components/Page Header',
  component: HeaderDemo,
  args: { title: 'Settings', colorScheme: 'light', scrollsBehindHeader: false },
  decorators: [
    (Story, { args, parameters }) => {
      const colors = useThemeColors(args.colorScheme);
      return (
        <LayoutDirectionProvider initialDirection={parameters.waveDirection ?? 'ltr'}>
          <SafeAreaInsetsContext.Provider value={{ top: 59, bottom: 34, left: 0, right: 0 }}>
            <View style={{ flex: 1, backgroundColor: colors.background }}>
              <PageMotionOverlay
                colorScheme={args.colorScheme}
                animate={Boolean(parameters.animateWaves)}
                visible={!parameters.withoutWaves}
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
export const Dark: Story = { args: { colorScheme: 'dark' } };
export const Scrolling: Story = { args: { title: 'Saved recipes', scrollsBehindHeader: true } };
export const FullHeightOverlay: Story = { args: { title: 'Overlay', headerOverlay: true } };
export const WithoutWaves: Story = { parameters: { withoutWaves: true } };
export const AnimatedLtr: Story = {
  args: { title: 'Animated waves', scrollsBehindHeader: true },
  parameters: { animateWaves: true, waveDirection: 'ltr' },
};
export const AnimatedRtl: Story = {
  ...AnimatedLtr,
  parameters: { animateWaves: true, waveDirection: 'rtl' },
};

function SettingsHeaderDemo() {
  const [presses, setPresses] = useState(0);
  return (
    <View style={{ flex: 1 }}>
      <SettingsPage language="fr" onBack={() => setPresses((value) => value + 1)} />
      <UniversalHost ignoreSafeArea="all">
        <Text testID="settings-header-back-count">{`Back presses: ${presses}`}</Text>
      </UniversalHost>
    </View>
  );
}

export const AppSettings: Story = {
  render: () => <SettingsHeaderDemo />,
  parameters: {
    docs: {
      description: {
        story:
          'Scroll the native settings form beneath the wave-shaped blur. The initial title clearance scrolls with the account section; the title and back action stay sharp.',
      },
    },
  },
};
export const DarkAppSettings: Story = { ...AppSettings, args: { colorScheme: 'dark' } };
