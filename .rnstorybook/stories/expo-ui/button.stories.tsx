import {
  Column,
  UniversalButton,
  UniversalButtonContent,
  type UniversalButtonProps,
  UniversalTextContent,
  UniversalText,
  UniversalHost,
} from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { action } from 'storybook/actions';

import { useAppTheme, useThemeColors } from '@/hooks/use-theme';
import { ThemePreferencesProvider } from '@/context/theme.context';
import { NativeStoryFrame } from '../../components/native-story-frame';
import { semanticButtonColors } from '../../components/semantic-button-colors';

function ButtonDemo(args: UniversalButtonProps) {
  const colors = semanticButtonColors(args.variant, useThemeColors(args.colorScheme));
  const [presses, setPresses] = useState(0);
  return (
    <NativeStoryFrame colorScheme={args.colorScheme}>
      <UniversalButton
        {...args}
        color={args.color ?? colors.color}
        contentColor={args.contentColor ?? colors.contentColor}
        onPress={() => {
          setPresses((value) => value + 1);
          args.onPress?.();
        }}
      />
      <UniversalText colorScheme={args.colorScheme} testID="expo-ui-button-presses">
        {`Presses: ${presses}`}
      </UniversalText>
    </NativeStoryFrame>
  );
}

const meta = {
  title: 'Expo UI/Universal Button',
  component: UniversalButton,
  args: {
    testID: 'expo-ui-button',
    label: 'Continue',
    variant: 'primary',
    colorScheme: 'dark',
    disabled: false,
    onPress: action('button pressed'),
  },
  argTypes: {
    label: { control: 'text' },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'link', 'success', 'warning', 'destructive', 'glass'],
    },
    fullWidth: { control: 'boolean' },
    borderRadius: { control: { type: 'number', min: 0 } },
    cornerRadii: { control: 'object' },
    colorScheme: { control: 'select', options: ['light', 'dark'] },
    disabled: { control: 'boolean' },
    onPress: { action: 'pressed', control: false },
  },
  render: (args) => <ButtonDemo {...args} />,
  parameters: {
    layout: 'fullscreen',
    controls: {
      include: [
        'label',
        'variant',
        'disabled',
        'fullWidth',
        'borderRadius',
        'cornerRadii',
        'colorScheme',
      ],
    },
  },
} satisfies Meta<typeof UniversalButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const Secondary: Story = { args: { label: 'Learn more', variant: 'secondary' } };
export const Link: Story = { args: { label: 'Skip for now', variant: 'link' } };
export const Success: Story = { args: { label: 'Save changes', variant: 'success' } };
export const Warning: Story = { args: { label: 'Review warning', variant: 'warning' } };
export const Destructive: Story = { args: { label: 'Delete item', variant: 'destructive' } };
export const Glass: Story = { args: { label: 'Glass button', variant: 'glass' } };
export const LightTheme: Story = { args: { colorScheme: 'light' } };
export const Disabled: Story = { args: { label: 'Unavailable', disabled: true } };
export const Rounded: Story = { args: { borderRadius: 24, contentPadding: 12, fullWidth: true } };
export const TopLeftBottomRight: Story = {
  args: {
    label: 'Top left / bottom right',
    cornerRadii: { topLeft: 24, bottomRight: 24 },
    contentPadding: 12,
    fullWidth: true,
  },
};
export const TopRightBottomLeft: Story = {
  args: {
    label: 'Top right / bottom left',
    cornerRadii: { topRight: 24, bottomLeft: 24 },
    contentPadding: 12,
    fullWidth: true,
  },
};

function InteractionDemo(args: UniversalButtonProps) {
  const [presses, setPresses] = useState(0);
  const theme = useAppTheme(args.colorScheme);
  const colors = theme.themeId === 'ux' ? {} : semanticButtonColors(args.variant, theme.colors);
  return (
    <NativeStoryFrame colorScheme={args.colorScheme}>
      <UniversalHost colorScheme={args.colorScheme}>
        <Column spacing={16}>
          <UniversalButtonContent
            {...colors}
            variant={args.variant}
            label="Count press"
            testID="button-count"
            borderRadius={12}
            contentPadding={12}
            onPress={() => setPresses((value) => value + 1)}
          />
          <UniversalButtonContent
            variant="secondary"
            label="Disabled press"
            testID="button-disabled"
            borderRadius={0}
            disabled
            onPress={() => setPresses((value) => value + 1)}
          />
          <UniversalTextContent testID="button-press-count">{`Presses: ${presses}`}</UniversalTextContent>
          <UniversalButtonContent
            variant="link"
            label="Reset count"
            testID="button-reset"
            onPress={() => setPresses(0)}
          />
        </Column>
      </UniversalHost>
    </NativeStoryFrame>
  );
}

export const Interaction: Story = { render: (args) => <InteractionDemo {...args} /> };

export const WireframeLight: Story = {
  args: { colorScheme: 'light' },
  render: (args) => (
    <ThemePreferencesProvider initialTheme="ux" initialColorScheme="light">
      <InteractionDemo {...args} />
    </ThemePreferencesProvider>
  ),
};
export const WireframeDark: Story = {
  args: { colorScheme: 'dark' },
  render: (args) => (
    <ThemePreferencesProvider initialTheme="ux" initialColorScheme="dark">
      <InteractionDemo {...args} />
    </ThemePreferencesProvider>
  ),
};
