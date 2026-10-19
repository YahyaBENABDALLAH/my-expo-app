import {
  Column,
  ReferenceNavigationBar,
  UniversalButtonContent,
  UniversalHost,
  UniversalTextContent,
  type FloatingActionKind,
  type NavigationTabName,
} from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { View } from 'react-native';
import { useThemeColors } from '@/hooks/use-theme';
import { useRegisterTabAction } from '@/features/pages/tab-actions';

const kinds: FloatingActionKind[] = [
  'create',
  'continue',
  'filters',
  'active-filters',
  'liked',
  'profile',
  'submit',
];

type Props = {
  kind: FloatingActionKind;
  colorScheme: 'light' | 'dark';
  disabled: boolean;
  animate: boolean;
};

function FloatingActionDemo(args: Props) {
  const colors = useThemeColors(args.colorScheme);
  const [presses, setPresses] = useState(0);
  const [productionPresses, setProductionPresses] = useState(0);
  const [offset, setOffset] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [paused, setPaused] = useState(false);
  const [selected, setSelected] = useState<NavigationTabName>('index');
  const kind = kinds[(kinds.indexOf(args.kind) + offset) % kinds.length];
  // Also exercise the app's real tab-bar dispatcher, outside this story's bar.
  useRegisterTabAction('storybook', {
    kind,
    label: 'Production context action',
    disabled: args.disabled || disabled,
    onPress: () => setProductionPresses((value) => value + 1),
  });
  return (
    <View style={{ flex: 1, paddingBottom: 40, backgroundColor: colors.background }}>
      <View style={{ flex: 1, padding: 24 }}>
        <UniversalHost colorScheme={args.colorScheme}>
          <Column spacing={16}>
            <UniversalTextContent testID="floating-action-count">{`Presses: ${presses}`}</UniversalTextContent>
            <UniversalTextContent testID="floating-action-production-count">{`Production presses: ${productionPresses}`}</UniversalTextContent>
            <UniversalTextContent testID="floating-action-kind">{`Action: ${kind}`}</UniversalTextContent>
            <UniversalTextContent>{`Selected: ${selected}`}</UniversalTextContent>
            <UniversalButtonContent
              variant="secondary"
              testID="floating-action-next-icon"
              label="Next icon"
              onPress={() => setOffset((value) => value + 1)}
            />
            <UniversalButtonContent
              variant="secondary"
              testID="floating-action-toggle-disabled"
              label={disabled ? 'Enable action' : 'Disable action'}
              onPress={() => setDisabled((value) => !value)}
            />
            <UniversalButtonContent
              variant="secondary"
              testID="floating-action-toggle-motion"
              label={paused ? 'Resume motion' : 'Pause motion'}
              onPress={() => setPaused((value) => !value)}
            />
          </Column>
        </UniversalHost>
      </View>
      <ReferenceNavigationBar
        colorScheme={args.colorScheme}
        selected={selected}
        onSelect={setSelected}
        animate={args.animate && !paused}
        action={{
          kind,
          label: `Context action: ${kind}`,
          disabled: args.disabled || disabled,
          onPress: () => setPresses((value) => value + 1),
        }}
      />
    </View>
  );
}

const meta = {
  title: 'Components/FloatingAction',
  component: FloatingActionDemo,
  args: { kind: 'create', colorScheme: 'light', disabled: false, animate: true },
  argTypes: {
    kind: { control: 'select', options: kinds },
    disabled: { control: 'boolean' },
    animate: { control: 'boolean' },
  },
  render: (args) => <FloatingActionDemo {...args} />,
} satisfies Meta<Props>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Interaction: Story = {};
