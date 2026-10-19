import { useThemeColors } from '@/hooks/use-theme';
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
  const colors = useThemeColors(args.colorScheme);
  return (
    <UniversalColumn {...args} style={{ backgroundColor: colors.surface, ...args.style }}>
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
  title: 'Components/Column',
  component: ColumnDemo,
  args: {
    testID: 'expo-ui-column',
    alignment: 'start',
    spacing: 12,
    itemCount: 3,
    nested: false,
    disabled: false,
    hidden: false,
    style: { width: 260, padding: 16, borderRadius: 12 },
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
} satisfies Meta<typeof ColumnDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const StartAligned: Story = {};
