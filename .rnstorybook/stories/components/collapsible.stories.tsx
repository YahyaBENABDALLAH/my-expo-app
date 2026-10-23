import { Column, UniversalTextContent as Text } from '@components/ui';
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
      <Column testID={args.testID ? `${args.testID}-content` : undefined} spacing={8}>
        <Text
          testID={args.testID ? `${args.testID}-text` : undefined}
          textStyle={{
            fontSize: 16,
          }}
        >
          {content}
        </Text>
      </Column>
    </UniversalCollapsible>
  );
}

const meta = {
  title: 'Components/Collapsible',
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
} satisfies Meta<typeof CollapsibleDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Collapsed: Story = {};
