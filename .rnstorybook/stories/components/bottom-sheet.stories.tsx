import {
  BottomSheet,
  type BottomSheetProps,
  Column,
  UniversalButtonContent,
  UniversalText,
  UniversalTextContent,
  UniversalButton,
  nativeFillWidth,
} from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { View } from 'react-native';
import { action } from 'storybook/actions';
import { NativeStoryFrame } from '../../components/native-story-frame';

type DemoProps = BottomSheetProps & {
  colorScheme: 'light' | 'dark';
  title: string;
  content: string;
  onOpen: () => void;
  onClose: () => void;
};

function BottomSheetDemo({ title, content, onOpen, onClose, ...args }: DemoProps) {
  const [isPresented, setIsPresented] = useState(args.isPresented);
  const [controlledPresentation, setControlledPresentation] = useState(args.isPresented);
  if (controlledPresentation !== args.isPresented) {
    setControlledPresentation(args.isPresented);
    setIsPresented(args.isPresented);
  }
  return (
    <View style={{ gap: 20 }}>
      <UniversalButton
        variant="secondary"
        testID={args.testID ? `${args.testID}-open` : undefined}
        label="Open bottom sheet"
        colorScheme={args.colorScheme}
        onPress={() => {
          setIsPresented(true);
          onOpen();
        }}
      />
      <UniversalText
        testID={args.testID ? `${args.testID}-state` : undefined}
        colorScheme={args.colorScheme}
      >
        {`State: ${isPresented ? 'Open' : 'Closed'}. Swipe down or tap Close to dismiss.`}
      </UniversalText>
      <UniversalText colorScheme={args.colorScheme}>
        The sheet uses the active theme surface color and native dismissal. The iOS drag indicator
        is hidden.
      </UniversalText>
      <BottomSheet
        {...args}
        isPresented={isPresented}
        onDismiss={() => {
          setIsPresented(false);
          args.onDismiss();
        }}
      >
        <Column
          testID={args.testID ? `${args.testID}-content` : undefined}
          spacing={16}
          modifiers={nativeFillWidth}
        >
          <UniversalTextContent
            testID={args.testID ? `${args.testID}-title` : undefined}
            textStyle={{ fontSize: 24, fontWeight: '700' }}
          >
            {title}
          </UniversalTextContent>
          <UniversalTextContent
            testID={args.testID ? `${args.testID}-description` : undefined}
            textStyle={{ fontSize: 16 }}
          >
            {content}
          </UniversalTextContent>
          <UniversalButtonContent
            variant="secondary"
            fullWidth
            testID={args.testID ? `${args.testID}-close` : undefined}
            label="Close"
            onPress={() => {
              setIsPresented(false);
              onClose();
            }}
          />
        </Column>
      </BottomSheet>
    </View>
  );
}

const meta = {
  title: 'Components/Bottom Sheet',
  component: BottomSheetDemo,
  args: {
    testID: 'expo-ui-bottom-sheet',
    isPresented: false,
    title: 'A native bottom sheet',
    content: 'Swipe down to dismiss this sheet, or close it and open it again.',
    colorScheme: 'dark',
    onOpen: action('open button pressed'),
    onClose: action('close button pressed'),
    onDismiss: action('sheet dismissed'),
  },
  argTypes: {
    isPresented: { control: 'boolean' },
    title: { control: 'text' },
    content: { control: 'text' },
    contentHeight: { control: { type: 'number', min: 1 } },
    children: { control: false },
    onOpen: { control: false },
    onClose: { control: false },
    onDismiss: { control: false },
  },
  render: (args) => (
    <NativeStoryFrame {...args}>
      <BottomSheetDemo {...args} />
    </NativeStoryFrame>
  ),
} satisfies Meta<typeof BottomSheetDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Light: Story = { args: { colorScheme: 'light', isPresented: true } };
export const Dark: Story = { args: { colorScheme: 'dark', isPresented: true } };

export const FixedContentHeight: Story = { args: { contentHeight: 320 } };
