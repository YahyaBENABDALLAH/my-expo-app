import {
  OtpBottomSheet,
  UniversalButton,
  UniversalText,
  type OtpBottomSheetProps,
} from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { View } from 'react-native';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';
import { NativeStoryFrame } from '../../components/native-story-frame';

// Isolate fixture copy without changing the user's saved/app language.
const previewI18n = i18n.cloneInstance({ lng: 'en', initAsync: false });

type DemoProps = Pick<OtpBottomSheetProps, 'colorScheme' | 'resendCooldownSeconds'> & {
  recipient?: string;
  requestFailure?: boolean;
  resendFailure?: boolean;
};

function OtpDemo({
  colorScheme = 'light',
  resendCooldownSeconds = 0,
  requestFailure,
  resendFailure,
  recipient = 'hello@likan.app',
}: DemoProps) {
  const [open, setOpen] = useState(false);
  const [resends, setResends] = useState(0);
  return (
    <View style={{ gap: 16 }}>
      <UniversalButton
        variant="primary"
        label="Open OTP sheet"
        testID="otp-demo-open"
        colorScheme={colorScheme}
        onPress={() => setOpen(true)}
      />
      <UniversalText
        testID="otp-demo-state"
        colorScheme={colorScheme}
      >{`Sheet: ${open ? 'Open' : 'Closed'} · Resends: ${resends}`}</UniversalText>
      <OtpBottomSheet
        isPresented={open}
        onDismiss={() => setOpen(false)}
        colorScheme={colorScheme}
        recipient={recipient}
        hint="Preview code: 123456"
        resendCooldownSeconds={resendCooldownSeconds}
        onVerify={async (code) => {
          await new Promise((resolve) => setTimeout(resolve, 650));
          if (requestFailure) throw new Error('Preview request failure');
          return code === '123456';
        }}
        onResend={async () => {
          await new Promise((resolve) => setTimeout(resolve, 500));
          if (resendFailure) throw new Error('Preview resend failure');
          setResends((count) => count + 1);
        }}
      />
    </View>
  );
}

const meta = {
  title: 'Expo UI/OTP Bottom Sheet',
  component: OtpDemo,
  args: { colorScheme: 'light', resendCooldownSeconds: 0 },
  argTypes: {
    colorScheme: { control: 'select', options: ['light', 'dark'] },
    resendCooldownSeconds: { control: 'number' },
    requestFailure: { control: 'boolean' },
    resendFailure: { control: 'boolean' },
  },
  decorators: [
    (Story, { args }) => (
      <I18nextProvider i18n={previewI18n}>
        <NativeStoryFrame colorScheme={args.colorScheme}>
          <Story />
        </NativeStoryFrame>
      </I18nextProvider>
    ),
  ],
} satisfies Meta<typeof OtpDemo>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Light: Story = {};
export const Dark: Story = { args: { colorScheme: 'dark' } };
export const ResendCountdown: Story = { args: { resendCooldownSeconds: 30 } };
export const RequestFailure: Story = { args: { requestFailure: true } };
export const ResendFailure: Story = { args: { resendFailure: true } };
export const LongRecipient: Story = {
  args: { recipient: 'a.long.verification.address@example.com' },
};
