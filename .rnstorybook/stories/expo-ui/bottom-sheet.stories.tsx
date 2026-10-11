import Colors from '@/constants/colors';
import {
  Column,
  UniversalButtonContent,
  UniversalText,
  UniversalTextContent,
  UniversalButton,
  nativeFillWidth,
} from '@components/ui';
import {
  UniversalBottomSheet,
  type UniversalBottomSheetProps,
} from '../../components/showcase/universal-bottom-sheet';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { View } from 'react-native';

import { action } from 'storybook/actions';
import { NativeStoryFrame, nativeThemeControls } from '../../components/native-story-frame';

type DemoProps = UniversalBottomSheetProps & {
  title: string;
  content: string;
  onOpen: () => void;
  onClose: () => void;
};

function BottomSheetDemo({ title, content, onOpen, onClose, ...args }: DemoProps) {
  const [isPresented, setIsPresented] = useState(args.isPresented);
  const ink = args.colorScheme === 'light' ? Colors.light.text : Colors.dark.text;
  return (
    <View style={{ gap: 20 }}>
      <UniversalButton
        variant="secondary"
        testID={`${args.testID}-open`}
        label="Open bottom sheet"
        colorScheme={args.colorScheme}
        onPress={() => {
          setIsPresented(true);
          onOpen();
        }}
      />
      <UniversalText
        testID={`${args.testID}-state`}
        colorScheme={args.colorScheme}
        textStyle={{ color: ink }}
      >
        {`State: ${isPresented ? 'Open' : 'Closed'}. Swipe down or tap Close to dismiss.`}
      </UniversalText>
      <UniversalText colorScheme={args.colorScheme} textStyle={{ color: ink }}>
        Android supports partial and expanded states; custom heights and fractions use the nearest
        native state.
      </UniversalText>
      <UniversalBottomSheet
        {...args}
        isPresented={isPresented}
        onDismiss={() => {
          setIsPresented(false);
          args.onDismiss();
        }}
      >
        <Column testID={`${args.testID}-content`} spacing={16} modifiers={nativeFillWidth}>
          <UniversalTextContent
            testID={`${args.testID}-title`}
            textStyle={{ fontSize: 24, fontWeight: '700', color: ink }}
          >
            {title}
          </UniversalTextContent>
          <UniversalTextContent
            testID={`${args.testID}-description`}
            textStyle={{ fontSize: 16, color: ink }}
          >
            {content}
          </UniversalTextContent>
          <UniversalButtonContent
            variant="secondary"
            fullWidth
            testID={`${args.testID}-close`}
            label="Close"
            onPress={() => {
              setIsPresented(false);
              onClose();
            }}
          />
        </Column>
      </UniversalBottomSheet>
    </View>
  );
}

const meta = {
  title: 'Expo UI/Universal Bottom Sheet',
  component: BottomSheetDemo,
  args: {
    testID: 'expo-ui-bottom-sheet',
    isPresented: false,
    title: 'A native bottom sheet',
    content: 'Drag the handle to resize this sheet, or close it and open it again.',
    colorScheme: 'dark',
    showDragIndicator: true,
    contentPadding: 24,
    shouldDismissOnBackPress: true,
    shouldDismissOnClickOutside: true,
    onOpen: action('open button pressed'),
    onClose: action('close button pressed'),
    onDismiss: action('sheet dismissed'),
  },
  argTypes: {
    ...nativeThemeControls,
    isPresented: { control: 'boolean' },
    title: { control: 'text' },
    content: { control: 'text' },
    showDragIndicator: { control: 'boolean' },
    snapPoints: { control: 'object' },
    contentPadding: { control: 'object' },
    shouldDismissOnBackPress: { control: 'boolean', description: 'Android only.' },
    shouldDismissOnClickOutside: {
      control: 'boolean',
      description: 'Android only; swipe dismissal remains available.',
    },
    scrimColor: { control: 'color', description: 'Android only.' },
    containerColor: { control: 'color' },
    contentColor: {
      control: 'color',
      description: 'Android only; explicit child colors take precedence.',
    },
    children: { control: false },
    modifiers: { control: false },
    onOpen: { control: false },
    onClose: { control: false },
    onDismiss: { control: false },
  },
  render: (args) => (
    <NativeStoryFrame {...args}>
      <BottomSheetDemo
        key={`${args.isPresented}-${JSON.stringify(args.snapPoints)}-${args.colorScheme}`}
        {...args}
      />
    </NativeStoryFrame>
  ),
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof BottomSheetDemo>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {};
export const Open: Story = { args: { isPresented: true } };
export const AutoSized: Story = { args: { content: 'A short sheet fitted to its content.' } };
export const HalfAndFull: Story = { args: { snapPoints: ['half', 'full'] } };
export const FullHeight: Story = { args: { snapPoints: ['full'] } };
export const CustomFraction: Story = { args: { snapPoints: [{ fraction: 0.35 }, 'full'] } };
export const FixedHeight: Story = { args: { snapPoints: [{ height: 320 }] } };
export const WithoutDragIndicator: Story = { args: { showDragIndicator: false } };
export const NoOutsideDismiss: Story = { args: { shouldDismissOnClickOutside: false } };
export const NoBackDismiss: Story = { args: { shouldDismissOnBackPress: false } };
export const CustomScrim: Story = { args: { scrimColor: Colors.dark.overlay } };
export const CustomBackground: Story = { args: { containerColor: Colors.light.text } };
export const EdgePadding: Story = {
  args: { contentPadding: { top: 8, bottom: 32, left: 20, right: 20 } },
};
export const LightTheme: Story = { args: { colorScheme: 'light' } };
export const DarkTheme: Story = { args: { colorScheme: 'dark' } };
export const LongContent: Story = {
  args: {
    title: 'A longer title that wraps onto multiple lines in a narrow sheet',
    content:
      'This description should wrap inside the sheet with the same leading edge as the title and the full-width Close button. Resize the sheet on iPad to check that it follows the presented width.',
  },
};
