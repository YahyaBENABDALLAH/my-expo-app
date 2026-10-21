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
import { useAppTheme } from '@/hooks/use-theme';
import { NativeStoryFrame } from '../../components/native-story-frame';
import { semanticButtonColors } from '../../components/semantic-button-colors';
import type { StoryThemeProps } from '../../components/story-theme';

function ButtonDemo(args: UniversalButtonProps) {
  const theme = useAppTheme(args.colorScheme);
  const colors =
    theme.themeId === 'ux' || args.color !== undefined || args.contentColor !== undefined
      ? {}
      : semanticButtonColors(args.variant, theme.colors);
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
  title: 'Components/Button',
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
      options: [
        'primary',
        'secondary',
        'tertiary',
        'link',
        'success',
        'warning',
        'destructive',
        'info',
        'glass',
      ],
    },
    fullWidth: { control: 'boolean' },
    borderRadius: { control: { type: 'number', min: 0 } },
    contentPadding: { control: { type: 'number', min: 0 } },
    cornerRadii: { control: 'object' },
    color: { control: 'color' },
    contentColor: { control: 'color' },
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
        'contentPadding',
        'cornerRadii',
        'color',
        'contentColor',
        'colorScheme',
        'themeId',
      ],
    },
  },
} satisfies Meta<UniversalButtonProps & StoryThemeProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const Secondary: Story = { args: { variant: 'secondary', label: 'Save for later' } };
export const Tertiary: Story = { args: { variant: 'tertiary', label: 'Maybe later' } };
export const Link: Story = { args: { variant: 'link', label: 'View details' } };
export const Success: Story = { args: { variant: 'success', label: 'Confirm' } };
export const Warning: Story = { args: { variant: 'warning', label: 'Review changes' } };
export const Destructive: Story = { args: { variant: 'destructive', label: 'Delete recipe' } };
export const Info: Story = { args: { variant: 'info', label: 'Learn more' } };
export const Glass: Story = { args: { variant: 'glass', label: 'Open options' } };

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
