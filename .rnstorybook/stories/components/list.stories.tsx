import { useThemeColors } from '@/hooks/use-theme';
import {
  Icon,
  ListItem,
  UniversalTextContent as Text,
  UniversalText as RNText,
} from '@components/ui';
import { UniversalList, type UniversalListProps } from '../../components/showcase/universal-list';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { View } from 'react-native';
import { action } from 'storybook/actions';
import { NativeStoryFrame, nativeThemeControls } from '../../components/native-story-frame';

const leadingIcon = Icon.select({
  ios: 'star.fill',
  android: require('@expo/material-symbols/star.xml'),
});

type DemoProps = UniversalListProps & {
  itemCount: number;
  supportingText: boolean;
  showLeading: boolean;
  showTrailing: boolean;
  disabledRows: boolean;
  refreshable: boolean;
  onRowPress: (row: number) => void;
  onRefreshRequested: () => void;
};

function ListDemo({
  itemCount,
  supportingText,
  showLeading,
  showTrailing,
  disabledRows,
  refreshable,
  onRowPress,
  onRefreshRequested,
  ...args
}: DemoProps) {
  const colors = useThemeColors(args.colorScheme);
  const [selected, setSelected] = useState<number | null>(null);
  const [refreshCount, setRefreshCount] = useState(0);
  return (
    <View style={{ gap: 16 }}>
      <RNText testID={`${args.testID}-status`}>
        {`Selected row: ${selected ?? 'None'} · Refresh count: ${refreshCount}`}
      </RNText>
      <UniversalList
        {...args}
        onRefresh={
          refreshable
            ? async () => {
                onRefreshRequested();
                await new Promise<void>((resolve) => setTimeout(resolve, 600));
                setRefreshCount((count) => count + 1);
              }
            : undefined
        }
      >
        {itemCount === 0 ? (
          <ListItem testID={`${args.testID}-empty`}>
            <Text testID={`${args.testID}-empty-text`}>No items available</Text>
          </ListItem>
        ) : null}
        {Array.from({ length: itemCount }, (_, i) => (
          <ListItem
            key={i}
            testID={`${args.testID}-row-${i + 1}`}
            supportingText={supportingText ? `Supporting details for item ${i + 1}` : undefined}
            onPress={
              disabledRows
                ? undefined
                : () => {
                    setSelected(i + 1);
                    onRowPress(i + 1);
                  }
            }
          >
            {showLeading ? (
              <ListItem.Leading>
                <Icon
                  name={leadingIcon}
                  size={24}
                  color={colors.text}
                  testID={`${args.testID}-row-${i + 1}-icon`}
                />
              </ListItem.Leading>
            ) : null}
            <Text testID={`${args.testID}-row-${i + 1}-label`}>{`Item ${i + 1}`}</Text>
            {showTrailing ? (
              <ListItem.Trailing>
                <Text testID={`${args.testID}-row-${i + 1}-trailing`}>
                  {selected === i + 1 ? 'Selected' : 'Open'}
                </Text>
              </ListItem.Trailing>
            ) : null}
          </ListItem>
        ))}
      </UniversalList>
    </View>
  );
}

const meta = {
  title: 'Components/List',
  component: ListDemo,
  args: {
    testID: 'expo-ui-list',
    itemCount: 8,
    supportingText: true,
    showLeading: true,
    showTrailing: true,
    disabledRows: false,
    refreshable: false,
    viewportHeight: 400,
    colorScheme: 'dark',
    onRowPress: action('list row pressed'),
    onRefreshRequested: action('list refresh requested'),
  },
  argTypes: {
    ...nativeThemeControls,
    itemCount: { control: { type: 'number', min: 0, max: 30, step: 1 } },
    supportingText: { control: 'boolean' },
    showLeading: { control: 'boolean' },
    showTrailing: { control: 'boolean' },
    disabledRows: { control: 'boolean' },
    refreshable: { control: 'boolean' },
    viewportHeight: { control: { type: 'number', min: 200, max: 600 } },
    children: { control: false },
    onRefresh: { control: false },
    onRowPress: { control: false },
    onRefreshRequested: { control: false },
  },
  render: (args) => (
    <NativeStoryFrame {...args}>
      <ListDemo key={String(args.refreshable)} {...args} />
    </NativeStoryFrame>
  ),
} satisfies Meta<typeof ListDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

function CompoundSlotsDemo(args: DemoProps) {
  const [presses, setPresses] = useState(0);
  return (
    <View style={{ gap: 16 }}>
      <RNText
        colorScheme={args.colorScheme}
        testID="list-compound-status"
      >{`Row presses: ${presses}`}</RNText>
      <UniversalList {...args}>
        <ListItem
          testID="list-compound-row"
          leading="Shorthand leading"
          supportingText="Shorthand supporting"
          trailing="Shorthand trailing"
          onPress={() => setPresses((count) => count + 1)}
        >
          <>
            {'A shared row with nested compound slots'}
            <>
              <ListItem.Leading>Badge</ListItem.Leading>
              <ListItem.Supporting>{0}</ListItem.Supporting>
              <ListItem.Trailing>Open</ListItem.Trailing>
            </>
          </>
        </ListItem>
        <ListItem testID="list-compound-passive-row">Row without an action</ListItem>
      </UniversalList>
    </View>
  );
}

export const CompoundSlots: Story = {
  render: (args) => (
    <NativeStoryFrame {...args}>
      <CompoundSlotsDemo {...args} />
    </NativeStoryFrame>
  ),
};
