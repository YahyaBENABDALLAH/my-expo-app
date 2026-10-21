import {
  Column,
  UniversalHost as Host,
  Icon,
  UniversalTextContent as Text,
  type TextInputRef,
  UniversalButtonContent,
  TextInput,
  type TextInputProps,
} from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useRef, useState } from 'react';
import { View } from 'react-native';
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

/** Story-only RN boundary; application fields compose inside their existing Host. */
function InputPreview(props: TextInputProps) {
  return (
    <Host colorScheme={props.colorScheme} testID={`${props.testID}-container`}>
      <TextInput {...props} />
    </Host>
  );
}

const meta = {
  title: 'Components/Text Input',
  component: TextInput,
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
    <InputPreview key={`${args.defaultValue}-${args.autoFocus}-${args.multiline}`} {...args} />
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
} satisfies Meta<typeof TextInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

function IconInputDemo(args: TextInputProps) {
  const [value, setValue] = useState(args.defaultValue ?? '');
  const [pressCount, setPressCount] = useState(0);
  const [disabled, setDisabled] = useState(args.disabled ?? false);
  return (
    <View style={{ gap: 20 }}>
      <InputPreview
        {...args}
        leftIcon={searchIcon}
        rightIcon={clearIcon}
        value={value}
        onChangeText={(text) => {
          setValue(text);
          args.onChangeText?.(text);
        }}
        disabled={disabled}
        onRightIconPress={() => {
          setValue('');
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
    rightIconAccessibilityLabel: 'Clear search',
    helperText: 'Compact icon action: tap to clear. Disable the field to check action suppression.',
  },
  render: (args) => <IconInputDemo key={`${args.defaultValue}-${args.disabled}`} {...args} />,
};

const Password: Story = {
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

function PasswordVisibilityDemo(args: TextInputProps) {
  const [value, setValue] = useState(args.defaultValue ?? '');
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
        <InputPreview
          {...args}
          value={value}
          onChangeText={(text) => {
            setValue(text);
            args.onChangeText?.(text);
          }}
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

function InputActionsDemo(args: TextInputProps) {
  const ref = useRef<TextInputRef>(null);
  const [focused, setFocused] = useState(false);
  return (
    <View style={{ gap: 20 }}>
      <InputPreview
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

function ControlledInputDemo(args: TextInputProps) {
  const [value, setValue] = useState(args.defaultValue ?? '');
  return (
    <View style={{ gap: 20 }}>
      <InputPreview
        {...args}
        value={value}
        onChangeText={(text) => {
          setValue(text);
          args.onChangeText?.(text);
        }}
      />
      <Host
        matchContents={{ vertical: true }}
        colorScheme={args.colorScheme}
        style={{ width: '100%' }}
      >
        <Column testID={`${args.testID}-actions`} spacing={10}>
          <Text testID={`${args.testID}-description`}>{`Controlled value: ${value}`}</Text>
          <UniversalButtonContent
            variant="secondary"
            testID={`${args.testID}-set-value`}
            label="Set value from JavaScript"
            onPress={() => {
              action('set value button pressed')();
              setValue('UPDATED');
            }}
          />
          <UniversalButtonContent
            variant="secondary"
            testID={`${args.testID}-reset`}
            label="Reset value"
            onPress={() => {
              action('reset button pressed')();
              setValue('');
            }}
          />
        </Column>
      </Host>
    </View>
  );
}

export const Controlled: Story = {
  args: {
    defaultValue: 'HELLO',
    autoCapitalize: 'none',
    autoCorrect: false,
    helperText: 'A regular string value supports editing, external updates and resets.',
  },
  render: (args) => <ControlledInputDemo key={args.defaultValue} {...args} />,
};
