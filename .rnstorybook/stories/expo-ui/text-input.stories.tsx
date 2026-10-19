import {
  Column,
  UniversalHost as Host,
  Icon,
  UniversalTextContent as Text,
  useNativeState,
  type TextInputRef,
  UniversalButtonContent,
  UniversalTextInput,
  UniversalTextInputContent,
  type UniversalTextInputProps,
} from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useCallback, useRef, useState } from 'react';
import { View } from 'react-native';
import { scheduleOnRN } from 'react-native-worklets';
import { action } from 'storybook/actions';

import { authInputIcons } from '@/components/ui/auth/auth-input-icons';

const searchIcon = Icon.select({
  ios: 'magnifyingglass',
  android: require('@expo/material-symbols/search.xml'),
});
const clearIcon = Icon.select({
  ios: 'xmark.circle.fill',
  android: require('@expo/material-symbols/cancel.xml'),
});

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
    label: { control: 'text' },
    placeholder: { control: 'text' },
    defaultValue: {
      control: 'text',
      description: 'Changing this control remounts the field with the new initial text.',
    },
    helperText: { control: 'text' },
    status: { control: 'select', options: ['default', 'error', 'success', 'warning'] },
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
    leftIcon: { control: false },
    rightIcon: { control: false },
    rightIconAccessibilityLabel: { control: 'text' },
    onRightIconPress: { action: 'right icon pressed', control: false },
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
    (Story, context) => (
      <View testID={`${context.args.testID}-canvas`} style={{ flex: 1, padding: 24 }}>
        <Story />
      </View>
    ),
  ],
  render: (args) => (
    <UniversalTextInput
      key={`${args.defaultValue}-${args.autoFocus}-${args.multiline}`}
      {...args}
    />
  ),
  parameters: {
    controls: {
      include: [
        'label',
        'placeholder',
        'defaultValue',
        'helperText',
        'status',
        'disabled',
        'readOnly',
        'autoFocus',
        'multiline',
        'secureTextEntry',
        'keyboardType',
        'colorScheme',
        'themeId',
      ],
    },
  },
} satisfies Meta<typeof UniversalTextInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

function IconInputDemo(args: UniversalTextInputProps) {
  const value = useNativeState(args.defaultValue ?? '');
  const [pressCount, setPressCount] = useState(0);
  const [disabled, setDisabled] = useState(args.disabled ?? false);
  return (
    <View style={{ gap: 20 }}>
      <UniversalTextInput
        {...args}
        value={value}
        disabled={disabled}
        onRightIconPress={() => {
          value.set('');
          setPressCount((count) => count + 1);
          action('right icon pressed')();
        }}
      />
      <Host
        matchContents={{ vertical: true }}
        colorScheme={args.colorScheme}
        style={{ width: '100%' }}
      >
        <Column spacing={10}>
          <Text testID={`${args.testID}-press-count`}>{`Right icon presses: ${pressCount}`}</Text>
          <UniversalButtonContent
            variant="secondary"
            testID={`${args.testID}-toggle-disabled`}
            label={disabled ? 'Enable input' : 'Disable input'}
            onPress={() => setDisabled((current) => !current)}
          />
        </Column>
      </Host>
    </View>
  );
}

export const ClickableRightIcon: Story = {
  args: {
    label: 'Search',
    placeholder: 'Search recipes',
    defaultValue: 'Soup',
    leftIcon: searchIcon,
    rightIcon: clearIcon,
    rightIconAccessibilityLabel: 'Clear search',
    helperText: 'Compact icon action: tap to clear. Disable the field to check action suppression.',
  },
  render: (args) => <IconInputDemo key={`${args.defaultValue}-${args.disabled}`} {...args} />,
};
export const ReadOnlyIcons: Story = {
  ...ClickableRightIcon,
  args: {
    ...ClickableRightIcon.args,
    readOnly: true,
    helperText: 'Text editing is blocked; the separate clear action is still available.',
  },
};
export const Focused: Story = {
  args: {
    autoFocus: true,
    helperText: 'The border uses the theme tint while focused and resets on blur.',
  },
  render: (args) => <InputActionsDemo {...args} />,
};
export const FocusedLight: Story = {
  ...Focused,
  args: { ...Focused.args, colorScheme: 'light' },
};
export const Disabled: Story = {
  args: {
    defaultValue: 'Unavailable',
    disabled: true,
    helperText:
      'Only the text dims while disabled. The border, background and label stay unchanged.',
  },
};
export const ReadOnly: Story = {
  args: {
    defaultValue: 'Account #2048',
    readOnly: true,
    helperText: 'Editing is blocked. Native selection behavior varies by platform.',
  },
};
export const ErrorState: Story = {
  name: 'Error',
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

function InheritedHostInputDemo(args: UniversalTextInputProps) {
  return (
    <Host colorScheme={args.colorScheme}>
      <Column spacing={12}>
        <UniversalTextInputContent
          testID="inherited-host-input"
          label={args.label}
          placeholder={args.placeholder}
          defaultValue={args.defaultValue}
          helperText="This field inherits its owning Host's theme."
          status={args.status}
          disabled={args.disabled}
          onChangeText={args.onChangeText}
        />
      </Column>
    </Host>
  );
}

export const InheritedHostLight: Story = {
  args: { colorScheme: 'light' },
  render: (args) => <InheritedHostInputDemo {...args} />,
};
export const InheritedHostDark: Story = {
  ...InheritedHostLight,
  args: { colorScheme: 'dark' },
};

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

function PasswordVisibilityDemo(args: UniversalTextInputProps) {
  const value = useNativeState(args.defaultValue ?? '');
  const [shown, setShown] = useState(false);
  const [layout, setLayout] = useState({ first: 0, current: 0 });
  const [toggles, setToggles] = useState(0);
  const stable = layout.first > 0 && Math.abs(layout.current - layout.first) < 0.5;
  return (
    <View style={{ gap: 16 }}>
      <View
        onLayout={({ nativeEvent }) => {
          const next = nativeEvent.layout.height;
          if (next <= 0) return;
          setLayout((previous) =>
            previous.current === next ? previous : { first: previous.first || next, current: next },
          );
        }}
      >
        <UniversalTextInput
          {...args}
          value={value}
          secureTextEntry={!shown}
          leftIcon={authInputIcons.password}
          rightIcon={shown ? authInputIcons.hidePassword : authInputIcons.showPassword}
          rightIconAccessibilityLabel={shown ? 'Hide password' : 'Show password'}
          onRightIconPress={() => {
            setShown((current) => !current);
            setToggles((count) => count + 1);
          }}
        />
      </View>
      <Host colorScheme={args.colorScheme}>
        <Column spacing={8}>
          <Text testID="password-layout-state">
            {`Height ${stable ? 'stable' : 'changed'}: ${Math.round(layout.current)} points`}
          </Text>
          <Text testID="password-visibility-state">
            {`Password ${shown ? 'shown' : 'hidden'} · Toggles: ${toggles}`}
          </Text>
        </Column>
      </Host>
    </View>
  );
}

export const PasswordVisibility: Story = {
  ...Password,
  args: {
    ...Password.args,
    helperText:
      'Tap the eye icon to reveal or hide the password. The field height stays stable in both modes.',
  },
  render: (args) => (
    <PasswordVisibilityDemo
      key={JSON.stringify([args.defaultValue, args.textStyle, args.colorScheme])}
      {...args}
    />
  ),
};
export const PasswordVisibilityLargeText: Story = {
  ...PasswordVisibility,
  args: { ...PasswordVisibility.args, textStyle: { fontSize: 24, lineHeight: 36 } },
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

function InputActionsDemo(args: UniversalTextInputProps) {
  const ref = useRef<TextInputRef>(null);
  const [focused, setFocused] = useState(false);
  return (
    <View style={{ gap: 20 }}>
      <UniversalTextInput
        {...args}
        ref={ref}
        onFocus={() => {
          setFocused(true);
          args.onFocus?.();
        }}
        onBlur={() => {
          setFocused(false);
          args.onBlur?.();
        }}
      />
      <Host
        matchContents={{ vertical: true }}
        colorScheme={args.colorScheme}
        style={{ width: '100%' }}
      >
        <Column testID={`${args.testID}-actions`} spacing={10}>
          <Text testID={`${args.testID}-focus-state`}>
            {focused ? 'Input focused' : 'Input blurred'}
          </Text>
          <UniversalButtonContent
            variant="secondary"
            testID={`${args.testID}-focus`}
            label="Focus"
            onPress={() => {
              action('focus button pressed')();
              ref.current?.focus();
            }}
          />
          <UniversalButtonContent
            variant="secondary"
            testID={`${args.testID}-blur`}
            label="Blur"
            onPress={() => {
              action('blur button pressed')();
              ref.current?.blur();
            }}
          />
          <UniversalButtonContent
            variant="secondary"
            testID={`${args.testID}-clear`}
            label="Clear"
            onPress={() => {
              action('clear button pressed')();
              ref.current?.clear();
            }}
          />
          <UniversalButtonContent
            variant="secondary"
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
          <Text testID={`${args.testID}-description`}>Edits are uppercased on the UI thread.</Text>
          <UniversalButtonContent
            variant="secondary"
            testID={`${args.testID}-set-value`}
            label="Set value from JavaScript"
            onPress={() => {
              action('set value button pressed')();
              value.set('UPDATED');
            }}
          />
          <UniversalButtonContent
            variant="secondary"
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

export const PasswordVisibilityEmpty: Story = {
  ...PasswordVisibility,
  args: { ...PasswordVisibility.args, defaultValue: '' },
};
export const PasswordVisibilityDisabled: Story = {
  ...PasswordVisibility,
  args: { ...PasswordVisibility.args, disabled: true },
};
