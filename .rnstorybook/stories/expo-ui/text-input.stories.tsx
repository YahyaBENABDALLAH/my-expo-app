import { Button, Column, Host, Text, useNativeState, type TextInputRef } from '@expo/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useCallback, useRef } from 'react';
import { Platform, ScrollView, View } from 'react-native';
import { scheduleOnRN } from 'react-native-worklets';
import { action } from 'storybook/actions';

import {
  UniversalTextInput,
  type UniversalTextInputProps,
} from '@/components/ui/universal-text-input';

const selectionNote =
  'Select-all and programmatic selection require iOS 18+; supported on Android. Secure fields ignore selection and multiline props on iOS.';

const meta = {
  title: 'Expo UI/Universal Text Input',
  component: UniversalTextInput,
  args: {
    testID: 'expo-ui-text-input',
    label: 'Display name',
    placeholder: 'Enter your name',
    defaultValue: '',
    helperText: 'This name appears on your profile.',
    status: 'default',
    colorScheme: 'dark',
    disabled: false,
    readOnly: false,
    autoFocus: false,
    multiline: false,
    secureTextEntry: false,
    autoCapitalize: 'sentences',
    autoCorrect: true,
    onPress: action('input pressed'),
    onFocus: action('input focused'),
    onBlur: action('input blurred'),
    onChangeText: action('text changed'),
    onSubmitEditing: action('input submitted'),
    onSelectionChange: action('selection changed'),
    onContentSizeChange: action('size changed'),
  },
  argTypes: {
    testID: { control: 'text' },
    label: { control: 'text' },
    placeholder: { control: 'text' },
    defaultValue: {
      control: 'text',
      description: 'Changing this control remounts the field with the new initial text.',
    },
    helperText: { control: 'text' },
    status: { control: 'select', options: ['default', 'error', 'success', 'warning'] },
    colorScheme: { control: 'select', options: ['light', 'dark'] },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    editable: { control: 'boolean', description: 'Overrides readOnly when explicitly set.' },
    autoFocus: { control: 'boolean' },
    multiline: { control: 'boolean' },
    secureTextEntry: { control: 'boolean' },
    autoCorrect: { control: 'boolean' },
    autoCapitalize: { control: 'select', options: ['none', 'sentences', 'words', 'characters'] },
    keyboardType: {
      control: 'select',
      options: ['default', 'email-address', 'number-pad', 'decimal-pad', 'phone-pad', 'url'],
    },
    returnKeyType: {
      control: 'select',
      options: ['default', 'done', 'go', 'next', 'search', 'send'],
    },
    inputMode: {
      control: 'select',
      options: ['text', 'decimal', 'numeric', 'tel', 'search', 'email', 'url'],
    },
    enterKeyHint: {
      control: 'select',
      options: ['enter', 'done', 'go', 'next', 'previous', 'search', 'send'],
    },
    autoComplete: {
      control: 'select',
      options: [
        'off',
        'name',
        'email',
        'tel',
        'username',
        'current-password',
        'new-password',
        'one-time-code',
      ],
    },
    numberOfLines: { control: { type: 'number', min: 1, max: 10 } },
    maxLength: { control: { type: 'number', min: 1, max: 500 } },
    textAlign: { control: 'select', options: ['auto', 'left', 'center', 'right'] },
    caretHidden: { control: 'boolean' },
    selectTextOnFocus: { control: 'boolean' },
    cursorColor: { control: 'color' },
    placeholderTextColor: { control: 'color' },
    selectionColor: { control: 'color' },
    selectionHandleColor: { control: 'color' },
    value: { control: false },
    selection: { control: false },
    ref: { control: false },
    modifiers: { control: false },
    onPress: { action: 'input pressed', control: false },
    onChangeText: { action: 'text changed' },
    onFocus: { action: 'focused' },
    onBlur: { action: 'blurred' },
    onSubmitEditing: { action: 'submitted' },
    onSelectionChange: { action: 'selection changed' },
    onContentSizeChange: { action: 'size changed' },
  },
  decorators: [
    (Story, context) => {
      // These stories are for the on-device iOS/Android Storybook only.
      if (Platform.OS !== 'ios' && Platform.OS !== 'android') return <></>;
      return (
        <ScrollView
          testID={`${context.args.testID}-canvas`}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flexGrow: 1,
            padding: 24,
            backgroundColor: context.args.colorScheme === 'light' ? '#F4F8FC' : '#081224',
          }}
        >
          <Story />
        </ScrollView>
      );
    },
  ],
  render: (args) => (
    <UniversalTextInput
      key={`${args.defaultValue}-${args.autoFocus}-${args.secureTextEntry}-${args.multiline}`}
      {...args}
    />
  ),
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof UniversalTextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};
export const Filled: Story = { args: { defaultValue: 'Alex Morgan' } };
export const Focused: Story = {
  args: { autoFocus: true, helperText: 'The border responds to native focus and blur.' },
};
export const Disabled: Story = {
  args: {
    defaultValue: 'Unavailable',
    disabled: true,
    helperText: 'Editing and touch interaction are disabled.',
  },
};
export const ReadOnly: Story = {
  args: {
    defaultValue: 'Account #2048',
    readOnly: true,
    helperText: 'Editing is blocked. Native selection behavior varies by platform.',
  },
};
export const NotEditable: Story = { args: { defaultValue: 'Locked value', editable: false } };
export const Error: Story = {
  args: {
    defaultValue: 'alex@',
    label: 'Email',
    status: 'error',
    helperText: 'Enter a valid email address.',
  },
};
export const Success: Story = {
  args: {
    defaultValue: 'alex@example.com',
    label: 'Email',
    status: 'success',
    helperText: 'Email address verified.',
  },
};
export const Warning: Story = {
  args: { defaultValue: 'alex', status: 'warning', helperText: 'This name is already in use.' },
};
export const LightTheme: Story = { args: { colorScheme: 'light' } };
export const DarkTheme: Story = { args: { colorScheme: 'dark' } };
export const Password: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter password',
    defaultValue: 'Example123!',
    secureTextEntry: true,
    autoComplete: 'current-password',
    autoCapitalize: 'none',
    autoCorrect: false,
    helperText: 'Native secure entry; selection and multiline are unavailable on iOS.',
  },
};
export const Multiline: Story = {
  args: {
    label: 'Bio',
    placeholder: 'Tell us about yourself',
    multiline: true,
    defaultValue: 'Designer and developer.\nBuilding thoughtful mobile experiences.',
    helperText: 'Grows naturally as you type.',
  },
};
export const FixedLines: Story = {
  args: { label: 'Notes', multiline: true, numberOfLines: 4, helperText: 'Reserves four lines.' },
};
export const CharacterLimit: Story = {
  args: {
    label: 'Short name',
    maxLength: 12,
    defaultValue: 'Twelve chars',
    helperText: 'Native limit: 12 characters. Try typing or pasting more.',
  },
};
export const Email: Story = {
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    keyboardType: 'email-address',
    autoComplete: 'email',
    autoCapitalize: 'none',
    autoCorrect: false,
    returnKeyType: 'next',
  },
};
export const Phone: Story = {
  args: {
    label: 'Phone',
    placeholder: '+212 600 000 000',
    keyboardType: 'phone-pad',
    autoComplete: 'tel',
  },
};
export const Number: Story = {
  args: {
    label: 'Quantity',
    placeholder: '0',
    keyboardType: 'number-pad',
    helperText: 'Numeric keyboard; keyboard hints do not validate pasted text.',
  },
};
export const Decimal: Story = {
  args: { label: 'Amount', placeholder: '0.00', keyboardType: 'decimal-pad' },
};
export const URL: Story = {
  args: {
    label: 'Website',
    placeholder: 'https://example.com',
    keyboardType: 'url',
    autoCapitalize: 'none',
    autoCorrect: false,
    returnKeyType: 'go',
  },
};
export const Search: Story = {
  args: {
    label: 'Search',
    placeholder: 'Search items',
    returnKeyType: 'search',
    autoCapitalize: 'none',
    helperText: 'Submit from the keyboard to see the Actions event.',
  },
};
export const OneTimeCode: Story = {
  args: {
    label: 'Verification code',
    placeholder: '123456',
    autoComplete: 'one-time-code',
    keyboardType: 'number-pad',
    maxLength: 6,
  },
};
export const CapitalizeWords: Story = {
  args: { autoCapitalize: 'words', helperText: 'Keyboard hint: capitalize each word.' },
};
export const NoAutocorrect: Story = {
  args: { label: 'Username', autoCapitalize: 'none', autoCorrect: false, autoComplete: 'username' },
};
export const CenterAligned: Story = {
  args: { defaultValue: 'Centered text', textAlign: 'center' },
};
export const RightAligned: Story = { args: { defaultValue: 'مرحبا بالعالم', textAlign: 'right' } };
export const SelectAllOnFocus: Story = {
  args: { defaultValue: 'Tap to select all', selectTextOnFocus: true, helperText: selectionNote },
};
export const HiddenCaret: Story = {
  args: {
    caretHidden: true,
    defaultValue: 'Hidden cursor',
    helperText: 'On iOS this also hides the selection highlight.',
  },
};
export const CustomSelectionColors: Story = {
  args: {
    defaultValue: 'Long press to select',
    selectionColor: '#A78BFA',
    cursorColor: '#E5AD49',
    selectionHandleColor: '#39B58D',
    helperText: 'Handle color is Android-only. On iOS selection color also tints the cursor.',
  },
};
export const KeyboardAliases: Story = {
  args: {
    label: 'Email',
    inputMode: 'email',
    enterKeyHint: 'send',
    helperText: 'inputMode and enterKeyHint map to native keyboard options.',
  },
};
export const WithoutLabel: Story = { args: { label: '', helperText: '' } };

function InputActionsDemo(args: UniversalTextInputProps) {
  const ref = useRef<TextInputRef>(null);
  return (
    <View style={{ gap: 20 }}>
      <UniversalTextInput {...args} ref={ref} />
      <Host
        matchContents={{ vertical: true }}
        colorScheme={args.colorScheme}
        style={{ width: '100%' }}
      >
        <Column testID={`${args.testID}-actions`} spacing={10}>
          <Button
            testID={`${args.testID}-focus`}
            label="Focus"
            onPress={() => {
              action('focus button pressed')();
              ref.current?.focus();
            }}
          />
          <Button
            testID={`${args.testID}-blur`}
            label="Blur"
            onPress={() => {
              action('blur button pressed')();
              ref.current?.blur();
            }}
          />
          <Button
            testID={`${args.testID}-clear`}
            label="Clear"
            onPress={() => {
              action('clear button pressed')();
              ref.current?.clear();
            }}
          />
          <Button
            testID={`${args.testID}-select`}
            label="Select first five characters"
            onPress={() => {
              action('select button pressed')();
              ref.current?.focus();
              void ref.current?.setSelection(0, 5);
            }}
          />
        </Column>
      </Host>
    </View>
  );
}

export const ImperativeActions: Story = {
  args: { defaultValue: 'Hello native input', helperText: selectionNote },
  render: (args) => <InputActionsDemo key={args.defaultValue} {...args} />,
};

function ControlledInputDemo(args: UniversalTextInputProps) {
  const value = useNativeState(args.defaultValue ?? '');
  const logChange = args.onChangeText;
  const onChangeText = useCallback(
    (text: string) => {
      'worklet';
      const transformed = text.toUpperCase();
      value.set(transformed);
      if (logChange) scheduleOnRN(logChange, transformed);
    },
    [value, logChange],
  );
  return (
    <View style={{ gap: 20 }}>
      <UniversalTextInput {...args} value={value} onChangeText={onChangeText} />
      <Host
        matchContents={{ vertical: true }}
        colorScheme={args.colorScheme}
        style={{ width: '100%' }}
      >
        <Column testID={`${args.testID}-actions`} spacing={10}>
          <Text
            testID={`${args.testID}-description`}
            textStyle={{ color: args.colorScheme === 'light' ? '#173C65' : '#DBEDF4' }}
          >
            Edits are uppercased on the UI thread.
          </Text>
          <Button
            testID={`${args.testID}-set-value`}
            label="Set value from JavaScript"
            onPress={() => {
              action('set value button pressed')();
              value.set('UPDATED');
            }}
          />
          <Button
            testID={`${args.testID}-reset`}
            label="Reset value"
            onPress={() => {
              action('reset button pressed')();
              value.set('');
            }}
          />
        </Column>
      </Host>
    </View>
  );
}

export const ControlledNativeState: Story = {
  args: {
    defaultValue: 'HELLO',
    autoCapitalize: 'none',
    autoCorrect: false,
    helperText: 'Uses useNativeState and a worklet; no React render on each keystroke.',
  },
  render: (args) => <ControlledInputDemo key={args.defaultValue} {...args} />,
};
