import { Icon, ListItem, Text } from '@expo/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { Text as RNText, View } from 'react-native';
import { action } from 'storybook/actions';
import { NativeStoryFrame, nativeThemeControls } from '../../components/native-story-frame';
import { UniversalList, type UniversalListProps } from '@/components/ui/universal-list';
import { UniversalListItem } from '@/components/ui/universal-list-item';

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
  const [selected, setSelected] = useState<number | null>(null);
  const [refreshCount, setRefreshCount] = useState(0);
  const ink = args.colorScheme === 'light' ? '#173C65' : '#DBEDF4';
  return (
    <View style={{ gap: 16 }}>
      <RNText testID={`${args.testID}-status`} style={{ color: ink }}>
        Selected row: {selected ?? 'None'} · Refresh count: {refreshCount}
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
          <UniversalListItem testID={`${args.testID}-empty`}>
            <Text testID={`${args.testID}-empty-text`} textStyle={{ color: ink }}>
              No items available
            </Text>
          </UniversalListItem>
        ) : null}
        {Array.from({ length: itemCount }, (_, i) => (
          <UniversalListItem
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
                  color={ink}
                  testID={`${args.testID}-row-${i + 1}-icon`}
                />
              </ListItem.Leading>
            ) : null}
            <Text
              testID={`${args.testID}-row-${i + 1}-label`}
              textStyle={{ color: ink }}
            >{`Item ${i + 1}`}</Text>
            {showTrailing ? (
              <ListItem.Trailing>
                <Text testID={`${args.testID}-row-${i + 1}-trailing`} textStyle={{ color: ink }}>
                  {selected === i + 1 ? 'Selected' : 'Open'}
                </Text>
              </ListItem.Trailing>
            ) : null}
          </UniversalListItem>
        ))}
      </UniversalList>
    </View>
  );
}

const meta = {
  title: 'Expo UI/Universal List',
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
    seedColor: '#5AB9E8',
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
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ListDemo>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const SimpleRows: Story = {
  args: { supportingText: false, showLeading: false, showTrailing: false },
};
export const WithoutLeading: Story = { args: { showLeading: false } };
export const WithoutTrailing: Story = { args: { showTrailing: false } };
export const SingleRow: Story = { args: { itemCount: 1 } };
export const Empty: Story = { args: { itemCount: 0 } };
export const ManyRows: Story = { args: { itemCount: 30 } };
export const DisabledRows: Story = { args: { disabledRows: true } };
export const PullToRefresh: Story = { args: { refreshable: true } };
export const CompactViewport: Story = { args: { viewportHeight: 240 } };
export const LightTheme: Story = { args: { colorScheme: 'light' } };
export const DarkTheme: Story = { args: { colorScheme: 'dark' } };
