import {
  Column,
  nativeFillWidth,
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
import { NativeStoryFrame } from '../../components/native-story-frame';
import { semanticButtonColors } from '../../components/semantic-button-colors';
import type { StoryThemeProps } from '../../components/story-theme';

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
    disabled: { control: 'boolean' },
    onPress: { action: 'pressed', control: false },
  },
  render: (args) => <ButtonDemo {...args} />,
  parameters: {
    controls: {
      include: [
        'label',
        'variant',
        'disabled',
        'fullWidth',
        'borderRadius',
        'cornerRadii',
        'colorScheme',
        'themeId',
      ],
    },
  },
} satisfies Meta<UniversalButtonProps & StoryThemeProps>;

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
  args: { themeId: 'ux', colorScheme: 'light' },
  render: (args) => <InteractionDemo {...args} />,
};
export const WireframeDark: Story = {
  args: { themeId: 'ux', colorScheme: 'dark' },
  render: (args) => <InteractionDemo {...args} />,
};

function GeometryDemo({ colorScheme = 'light' }: { colorScheme?: 'light' | 'dark' }) {
  const [presses, setPresses] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const press = () => setPresses((count) => count + 1);
  return (
    <NativeStoryFrame colorScheme={colorScheme}>
      <UniversalHost colorScheme={colorScheme}>
        <Column spacing={16} modifiers={nativeFillWidth} testID={`button-geometry-${colorScheme}`}>
          <UniversalButtonContent
            variant="primary"
            fullWidth
            label="Native geometry"
            testID="button-geometry-default"
            onPress={press}
          />
          <UniversalButtonContent
            variant="secondary"
            fullWidth
            borderRadius={12}
            contentPadding={16}
            label="Rounded geometry"
            testID="button-geometry-rounded"
            disabled={disabled}
            onPress={press}
          />
          <UniversalButtonContent
            variant="primary"
            fullWidth
            borderRadius={0}
            contentPadding={0}
            testID="button-geometry-square"
            disabled={disabled}
            onPress={press}
          >
            <Column spacing={8} modifiers={nativeFillWidth} style={{ padding: 16 }}>
              <UniversalTextContent>Square card action</UniversalTextContent>
              <UniversalTextContent variant="caption">
                Tap near either vertical edge.
              </UniversalTextContent>
            </Column>
          </UniversalButtonContent>
          <UniversalTextContent testID="button-geometry-count">{`Presses: ${presses}`}</UniversalTextContent>
          <UniversalButtonContent
            variant="link"
            label={disabled ? 'Enable custom buttons' : 'Disable custom buttons'}
            testID="button-geometry-toggle"
            onPress={() => setDisabled((value) => !value)}
          />
        </Column>
      </UniversalHost>
    </NativeStoryFrame>
  );
}

export const GeometryLight: Story = {
  args: { colorScheme: 'light' },
  render: (args) => <GeometryDemo colorScheme={args.colorScheme} />,
};
export const GeometryDark: Story = {
  args: { colorScheme: 'dark' },
  render: (args) => <GeometryDemo colorScheme={args.colorScheme} />,
};
