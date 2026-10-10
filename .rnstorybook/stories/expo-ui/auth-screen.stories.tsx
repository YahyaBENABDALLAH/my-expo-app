import {
  Column,
  nativeFillWidth,
  AuthScreenFrame,
  FormSubmit,
  FormTextInput,
  authInputIcons,
} from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { loginResolver } from '@/validation/resolvers/auth';
import type { LoginFormValues } from '@/validation/schemas/auth';

function NativeFormDemo({
  pending = false,
  icons = false,
  colorScheme = 'dark',
}: {
  pending?: boolean;
  icons?: boolean;
  colorScheme?: 'light' | 'dark';
}) {
  const [submissions, setSubmissions] = useState(0);
  const form = useForm<LoginFormValues>({
    resolver: loginResolver,
    defaultValues: { login: '', password: '' },
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });
  return (
    <AuthScreenFrame
      testID="native-form"
      colorScheme={colorScheme}
      title="One native Host"
      description="Validation keeps message space stable and provides error haptics. Fields, universal buttons and password visibility share one native Host."
    >
      <Column spacing={20} modifiers={nativeFillWidth}>
        <FormTextInput
          control={form.control}
          name="login"
          label="Email or username"
          leftIcon={icons ? authInputIcons.person : undefined}
          testID="native-form-login"
          disabled={pending}
          autoCapitalize="none"
          returnKeyType="next"
          onSubmitEditing={() => form.setFocus('password')}
          onEdited={() => {}}
        />
        <FormTextInput
          control={form.control}
          name="password"
          label="Password"
          leftIcon={icons ? authInputIcons.password : undefined}
          passwordToggle={icons ? 'icon' : 'button'}
          testID="native-form-password"
          password
          disabled={pending}
          onEdited={() => {}}
        />
        <FormSubmit
          testID="native-form-submit"
          label="Test submit"
          pending={pending}
          notice={`Submissions: ${submissions}`}
          onPress={() => void form.handleSubmit(() => setSubmissions((count) => count + 1))()}
        />
      </Column>
    </AuthScreenFrame>
  );
}

const meta = {
  title: 'Expo UI/Auth Screen',
  component: NativeFormDemo,
  args: { pending: false, icons: false, colorScheme: 'dark' },
  argTypes: {
    pending: { control: 'boolean' },
    icons: { control: 'boolean' },
    colorScheme: { control: 'select', options: ['light', 'dark'] },
  },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof NativeFormDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SharedHost: Story = {};
export const LightTheme: Story = { args: { colorScheme: 'light' } };
export const DarkTheme: Story = { args: { colorScheme: 'dark' } };
export const Pending: Story = { args: { pending: true } };
export const PasswordIcons: Story = { args: { icons: true } };
export const PendingPasswordIcons: Story = { args: { icons: true, pending: true } };
