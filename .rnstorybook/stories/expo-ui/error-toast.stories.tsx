import { ErrorToast, type ErrorToastProps, UniversalButton, UniversalText } from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useCallback, useState } from 'react';
import { View } from 'react-native';

import { NativeStoryFrame } from '../../components/native-story-frame';

function ToastDemo({ message, colorScheme }: Omit<ErrorToastProps, 'onDismiss'>) {
  const [visible, setVisible] = useState(false);
  const [shown, setShown] = useState(0);
  const [dismissals, setDismissals] = useState(0);
  const dismiss = useCallback(() => {
    setVisible(false);
    setDismissals((count) => count + 1);
  }, []);
  return (
    <NativeStoryFrame colorScheme={colorScheme}>
      <View style={{ gap: 16 }}>
        <UniversalButton
          variant="secondary"
          testID="toast-story-show"
          label="Show API error"
          colorScheme={colorScheme}
          disabled={visible}
          onPress={() => {
            setShown((count) => count + 1);
            setVisible(true);
          }}
        />
        <UniversalText testID="toast-story-state" colorScheme={colorScheme}>
          {`State: ${visible ? 'Visible' : 'Hidden'}. Dismissals: ${dismissals}`}
        </UniversalText>
        {visible && (
          <ErrorToast key={shown} message={message} onDismiss={dismiss} colorScheme={colorScheme} />
        )}
      </View>
    </NativeStoryFrame>
  );
}

const meta = {
  title: 'Expo UI/Error Toast',
  component: ToastDemo,
  args: { message: 'The email, username, or password is incorrect.', colorScheme: 'dark' },
  argTypes: {
    message: { control: 'text' },
    colorScheme: { control: 'select', options: ['light', 'dark'] },
  },
  render: (args) => <ToastDemo key={`${args.message}-${args.colorScheme}`} {...args} />,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ToastDemo>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Dark: Story = {};
export const Light: Story = { args: { colorScheme: 'light' } };
export const ValidationMessages: Story = {
  args: {
    message: 'Title is required.\nChoose a difficulty.\nChoose a unit for every ingredient.',
  },
};
export const LongMessage: Story = {
  args: {
    message:
      'Your recipe could not be saved because the server is temporarily unavailable. Your draft is still here. Check your connection and try publishing again.',
  },
};
