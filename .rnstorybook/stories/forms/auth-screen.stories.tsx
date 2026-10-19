import {
  AuroraBackground,
  Column,
  FieldGroup,
  nativeFillWidth,
  AuthScreenFrame,
  FormSubmit,
  FormTextInput,
  authInputIcons,
} from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { View } from 'react-native';
import { useForm } from 'react-hook-form';
import { loginResolver } from '@/validation/resolvers/auth';
import type { LoginFormValues } from '@/validation/schemas/auth';

function NativeFormDemo({
  pending = false,
  icons = false,
  loginHelperText,
  colorScheme = 'dark',
  grouped = false,
  viewportHeight,
}: {
  pending?: boolean;
  icons?: boolean;
  loginHelperText?: string;
  colorScheme?: 'light' | 'dark';
  grouped?: boolean;
  viewportHeight?: number;
}) {
  const [submissions, setSubmissions] = useState(0);
  const form = useForm<LoginFormValues>({
    resolver: loginResolver,
    defaultValues: { login: '', password: '' },
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });
  const fields = (
    <Column spacing={20} modifiers={nativeFillWidth}>
      <FormTextInput
        control={form.control}
        name="login"
        label="Email or username"
        helperText={loginHelperText}
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
  );
  return (
    <View style={viewportHeight === undefined ? { flex: 1 } : { height: viewportHeight }}>
      <AuthScreenFrame
        testID="native-form"
        colorScheme={colorScheme}
        grouped={grouped}
        title="One native Host"
        description="Fields reserve no empty message space. Errors and hints wrap below their input when present; validation provides error haptics."
      >
        {grouped ? <FieldGroup.Section title="Account">{fields}</FieldGroup.Section> : fields}
      </AuthScreenFrame>
    </View>
  );
}

const meta = {
  title: 'Forms/Login Form',
  component: NativeFormDemo,
  args: { pending: false, icons: false, colorScheme: 'dark' },
  argTypes: {
    pending: { control: 'boolean' },
    icons: { control: 'boolean' },
    loginHelperText: { control: 'text' },
    colorScheme: { control: 'select', options: ['light', 'dark'] },
    grouped: { control: 'boolean' },
    viewportHeight: { control: 'number' },
  },
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story, { args }) => (
      <View style={{ flex: 1 }}>
        <AuroraBackground
          colorScheme={args.colorScheme}
          animate={false}
          style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
        />
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof NativeFormDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SharedHost: Story = {};

export const Pending: Story = { args: { pending: true } };

export const GroupedForm: Story = { args: { grouped: true } };
