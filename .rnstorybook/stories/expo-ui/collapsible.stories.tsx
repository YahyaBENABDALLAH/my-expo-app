import Colors from '@/constants/colors';
import { Column, Text } from '@components/ui';
import {
  UniversalCollapsible,
  type UniversalCollapsibleProps,
} from '../../components/showcase/universal-collapsible';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { action } from 'storybook/actions';
import { NativeStoryFrame, nativeThemeControls } from '../../components/native-story-frame';

type DemoProps = UniversalCollapsibleProps & { content: string };

function CollapsibleDemo({ content, ...args }: DemoProps) {
  const [isOpen, setIsOpen] = useState(args.isOpen);
  return (
    <UniversalCollapsible
      {...args}
      isOpen={isOpen}
      onOpenChange={(next) => {
        setIsOpen(next);
        args.onOpenChange(next);
      }}
    >
      <Column testID={`${args.testID}-content`} spacing={8}>
        <Text
          testID={`${args.testID}-text`}
          textStyle={{
            fontSize: 16,
            color: args.colorScheme === 'light' ? Colors.light.text : Colors.dark.text,
          }}
        >
          {content}
        </Text>
      </Column>
    </UniversalCollapsible>
  );
}

const meta = {
  title: 'Expo UI/Universal Collapsible',
  component: CollapsibleDemo,
  args: {
    testID: 'expo-ui-collapsible',
    isOpen: false,
    label: 'More details',
    content: 'Tap the header to show or hide this content.',
    colorScheme: 'dark',
    onOpenChange: action('collapsible changed'),
  },
  argTypes: {
    ...nativeThemeControls,
    isOpen: { control: 'boolean' },
    label: { control: 'text' },
    content: { control: 'text' },
    labelStyle: { control: 'object' },
    children: { control: false },
    onOpenChange: { control: false },
  },
  render: (args) => (
    <NativeStoryFrame {...args}>
      <CollapsibleDemo key={String(args.isOpen)} {...args} />
    </NativeStoryFrame>
  ),
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof CollapsibleDemo>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Collapsed: Story = {};
export const Expanded: Story = { args: { isOpen: true } };
export const LongContent: Story = {
  args: {
    isOpen: true,
    content: Array.from(
      { length: 6 },
      (_, i) => `Detail ${i + 1}: Native content expands beneath the header.`,
    ).join('\n\n'),
  },
};
export const LongLabel: Story = {
  args: { label: 'Frequently asked questions about your account and notification preferences' },
};
export const CustomLabel: Story = {
  args: { labelStyle: { color: Colors.dark.primary, fontSize: 20, fontWeight: '700' } },
};
export const LightTheme: Story = { args: { colorScheme: 'light' } };
export const DarkTheme: Story = { args: { colorScheme: 'dark' } };

export const NativeTheme: Story = { args: { seedColor: Colors.light.tint } };
