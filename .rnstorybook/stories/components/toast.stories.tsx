import { Toast, type ToastProps, UniversalButton, UniversalText } from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { NativeStoryFrame } from '../../components/native-story-frame';
import { LayoutDirectionProvider } from '@/context/layout-direction.context';

function ToastDemo({
  variant,
  message,
  title,
  colorScheme,
  direction = 'ltr',
}: Omit<ToastProps, 'onDismiss'> & { direction?: 'ltr' | 'rtl' }) {
  const [visible, setVisible] = useState(false);
  const [shown, setShown] = useState(0);
  const [dismissals, setDismissals] = useState(0);
  const dismiss = useCallback(() => {
    setVisible(false);
    setDismissals((count) => count + 1);
  }, []);
  return (
    <LayoutDirectionProvider initialDirection={direction}>
      <NativeStoryFrame colorScheme={colorScheme}>
        <View style={{ gap: 16 }}>
          <UniversalButton
            variant="secondary"
            testID="toast-story-show"
            label="Show toast"
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
            <Toast
              key={shown}
              variant={variant}
              title={title}
              message={message}
              onDismiss={dismiss}
              colorScheme={colorScheme}
            />
          )}
        </View>
      </NativeStoryFrame>
    </LayoutDirectionProvider>
  );
}

const meta = {
  title: 'Components/Toast',
  component: ToastDemo,
  args: {
    variant: 'error',
    message: 'The email, username, or password is incorrect.',
    colorScheme: 'dark',
  },
  argTypes: {
    message: { control: 'text' },
    title: { control: 'text' },
    variant: { control: 'select', options: ['error', 'success', 'warning'] },
    direction: { control: 'select', options: ['ltr', 'rtl'] },
  },
  render: (args) => (
    <ToastDemo
      key={`${args.variant}-${args.title}-${args.message}-${args.colorScheme}-${args.direction}`}
      {...args}
    />
  ),
} satisfies Meta<typeof ToastDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Dark: Story = {};
