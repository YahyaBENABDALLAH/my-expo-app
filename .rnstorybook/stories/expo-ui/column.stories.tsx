import Colors from '@/constants/colors';
import { Column, Text } from '@components/ui';
import {
  UniversalColumn,
  type UniversalColumnProps,
} from '../../components/showcase/universal-column';
import type { Meta, StoryObj } from '@storybook/react-native';
import { action } from 'storybook/actions';
import { NativeStoryFrame, nativeThemeControls } from '../../components/native-story-frame';

type DemoProps = UniversalColumnProps & { itemCount: number; nested: boolean };

function ColumnDemo({ itemCount, nested, ...args }: DemoProps) {
  const colors = Colors[args.colorScheme ?? 'dark'];
  return (
    <UniversalColumn {...args}>
      {Array.from({ length: itemCount }, (_, i) => (
        <Text
          key={i}
          testID={`${args.testID}-item-${i + 1}`}
          style={{ padding: 12, borderRadius: 8, backgroundColor: colors.primaryContainer }}
          textStyle={{ color: colors.onPrimaryContainer, fontSize: 16 }}
        >{`Item ${i + 1}`}</Text>
      ))}
      {nested ? (
        <Column
          spacing={8}
          style={{ padding: 12, backgroundColor: colors.surfaceRaised, borderRadius: 12 }}
        >
          <Text textStyle={{ color: colors.text }}>Nested column</Text>
          <Text textStyle={{ color: colors.text }}>Second nested item</Text>
        </Column>
      ) : null}
    </UniversalColumn>
  );
}

const meta = {
  title: 'Expo UI/Universal Column',
  component: ColumnDemo,
  args: {
    testID: 'expo-ui-column',
    alignment: 'start',
    spacing: 12,
    itemCount: 3,
    nested: false,
    disabled: false,
    hidden: false,
    style: { width: 260, padding: 16, backgroundColor: Colors.dark.surface, borderRadius: 12 },
    colorScheme: 'dark',
    onPress: action('column pressed'),
    onAppear: action('column appeared'),
    onDisappear: action('column disappeared'),
  },
  argTypes: {
    ...nativeThemeControls,
    alignment: { control: 'select', options: ['start', 'center', 'end'] },
    spacing: { control: { type: 'number', min: 0, max: 48 } },
    itemCount: { control: { type: 'number', min: 0, max: 8, step: 1 } },
    nested: { control: 'boolean' },
    disabled: { control: 'boolean' },
    hidden: { control: 'boolean' },
    style: { control: 'object', description: 'Use numeric native width and height values.' },
    children: { control: false },
    modifiers: { control: false },
    onPress: { control: false },
    onAppear: { control: false },
    onDisappear: { control: false },
  },
  render: (args) => (
    <NativeStoryFrame {...args}>
      <ColumnDemo {...args} />
    </NativeStoryFrame>
  ),
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ColumnDemo>;
export default meta;
type Story = StoryObj<typeof meta>;

export const StartAligned: Story = {};
export const CenterAligned: Story = { args: { alignment: 'center' } };
export const EndAligned: Story = { args: { alignment: 'end' } };
export const NoSpacing: Story = { args: { spacing: 0 } };
export const WideSpacing: Story = { args: { spacing: 32 } };
export const Nested: Story = { args: { nested: true, itemCount: 1 } };
export const Empty: Story = { args: { itemCount: 0 } };
export const Disabled: Story = { args: { disabled: true } };
export const Hidden: Story = { args: { hidden: true } };
export const LightTheme: Story = {
  args: {
    colorScheme: 'light',
    style: { width: 260, padding: 16, backgroundColor: Colors.light.surface, borderRadius: 12 },
  },
};
export const DarkTheme: Story = { args: { colorScheme: 'dark' } };
