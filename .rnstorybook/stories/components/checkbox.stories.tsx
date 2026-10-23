import { UniversalText as RNText } from '@components/ui';
import {
  UniversalCheckbox,
  type UniversalCheckboxProps,
} from '../../components/showcase/universal-checkbox';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { View } from 'react-native';
import { action } from 'storybook/actions';
import { NativeStoryFrame, nativeThemeControls } from '../../components/native-story-frame';

function CheckboxDemo(args: UniversalCheckboxProps) {
  const [value, setValue] = useState(args.value);
  return (
    <View style={{ gap: 16 }}>
      <UniversalCheckbox
        {...args}
        value={value}
        onValueChange={(next) => {
          setValue(next);
          args.onValueChange(next);
        }}
      />
      <RNText
        testID={args.testID ? `${args.testID}-value` : undefined}
      >{`Value: ${value ? 'Checked' : 'Unchecked'}`}</RNText>
      <RNText variant="caption">
        Android uses a checkbox. iOS uses its native toggle appearance.
      </RNText>
    </View>
  );
}

const meta = {
  title: 'Components/Checkbox',
  component: UniversalCheckbox,
  args: {
    testID: 'expo-ui-checkbox',
    value: false,
    label: 'Accept terms and conditions',
    disabled: false,
    colorScheme: 'dark',
    onValueChange: action('checkbox changed'),
  },
  argTypes: {
    ...nativeThemeControls,
    value: { control: 'boolean' },
    label: { control: 'text' },
    disabled: { control: 'boolean' },
    onValueChange: { control: false },
    modifiers: { control: false },
  },
  render: (args) => (
    <NativeStoryFrame {...args}>
      <CheckboxDemo key={String(args.value)} {...args} />
    </NativeStoryFrame>
  ),
} satisfies Meta<typeof UniversalCheckbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Unchecked: Story = {};
