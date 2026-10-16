import Colors from '@/constants/colors';
import { Checkbox, Column, FieldGroup, Slider, Switch, Text } from '@components/ui';
import {
  UniversalFieldGroup,
  type UniversalFieldGroupProps,
} from '../../components/showcase/universal-field-group';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { action } from 'storybook/actions';
import { NativeStoryFrame, nativeThemeControls } from '../../components/native-story-frame';

type DemoProps = UniversalFieldGroupProps & {
  title: string;
  footer: string;
  titleUppercase: boolean;
  customHeader: boolean;
  singleRow: boolean;
  showSecondSection: boolean;
  notifications: boolean;
  accepted: boolean;
  volume: number;
  onNotificationsChange: (value: boolean) => void;
  onAcceptedChange: (value: boolean) => void;
  onVolumeChange: (value: number) => void;
};

function FieldGroupDemo({
  title,
  footer,
  titleUppercase,
  customHeader,
  singleRow,
  showSecondSection,
  notifications,
  accepted,
  volume,
  onNotificationsChange,
  onAcceptedChange,
  onVolumeChange,
  ...args
}: DemoProps) {
  const [notify, setNotify] = useState(notifications);
  const [checked, setChecked] = useState(accepted);
  const [level, setLevel] = useState(volume);
  const ink = args.colorScheme === 'light' ? Colors.light.text : Colors.dark.text;
  return (
    <UniversalFieldGroup {...args}>
      <FieldGroup.Section
        testID={`${args.testID}-preferences`}
        title={title}
        titleUppercase={titleUppercase}
      >
        {customHeader ? (
          <FieldGroup.SectionHeader>
            <Text textStyle={{ fontSize: 20, fontWeight: '700', color: ink }}>
              Custom section header
            </Text>
          </FieldGroup.SectionHeader>
        ) : null}
        <Switch
          testID={`${args.testID}-notifications`}
          label="Notifications"
          value={notify}
          disabled={args.disabled}
          onValueChange={(next) => {
            setNotify(next);
            onNotificationsChange(next);
          }}
        />
        {!singleRow ? (
          <Checkbox
            testID={`${args.testID}-terms`}
            label="Accept terms"
            value={checked}
            disabled={args.disabled}
            onValueChange={(next) => {
              setChecked(next);
              onAcceptedChange(next);
            }}
          />
        ) : null}
        <Text testID={`${args.testID}-state`} textStyle={{ color: ink }}>
          {`Notifications: ${notify ? 'On' : 'Off'} · Terms: ${checked ? 'Accepted' : 'Not accepted'}`}
        </Text>
        {footer ? (
          <FieldGroup.SectionFooter>
            <Text textStyle={{ color: ink, fontSize: 13 }}>{footer}</Text>
          </FieldGroup.SectionFooter>
        ) : null}
      </FieldGroup.Section>
      {showSecondSection ? (
        <FieldGroup.Section
          testID={`${args.testID}-audio`}
          title="Audio"
          titleUppercase={titleUppercase}
        >
          <Column spacing={8}>
            <Text
              testID={`${args.testID}-volume-value`}
              textStyle={{ color: ink }}
            >{`Volume: ${Math.round(level)}%`}</Text>
            <Slider
              testID={`${args.testID}-volume`}
              value={level}
              min={0}
              max={100}
              step={10}
              disabled={args.disabled}
              onValueChange={(next) => {
                setLevel(next);
                onVolumeChange(next);
              }}
            />
          </Column>
        </FieldGroup.Section>
      ) : null}
    </UniversalFieldGroup>
  );
}

const meta = {
  title: 'Expo UI/Universal Field Group',
  component: FieldGroupDemo,
  args: {
    testID: 'expo-ui-field-group',
    title: 'Preferences',
    footer: 'Changes are reflected in the controls and logged in Actions.',
    titleUppercase: false,
    customHeader: false,
    singleRow: false,
    showSecondSection: true,
    notifications: false,
    accepted: false,
    volume: 50,
    disabled: false,
    hidden: false,
    viewportHeight: 440,
    colorScheme: 'dark',
    onNotificationsChange: action('notifications changed'),
    onAcceptedChange: action('terms changed'),
    onVolumeChange: action('volume changed'),
    onAppear: action('field group appeared'),
    onDisappear: action('field group disappeared'),
  },
  argTypes: {
    ...nativeThemeControls,
    title: { control: 'text' },
    footer: { control: 'text' },
    titleUppercase: {
      control: 'boolean',
      description: 'Android only; iOS chooses native header casing.',
    },
    customHeader: { control: 'boolean' },
    singleRow: { control: 'boolean' },
    showSecondSection: { control: 'boolean' },
    notifications: { control: 'boolean' },
    accepted: { control: 'boolean' },
    volume: { control: { type: 'range', min: 0, max: 100, step: 10 } },
    disabled: { control: 'boolean' },
    hidden: { control: 'boolean' },
    viewportHeight: { control: { type: 'number', min: 200, max: 600 } },
    children: { control: false },
    modifiers: { control: false },
    onNotificationsChange: { control: false },
    onAcceptedChange: { control: false },
    onVolumeChange: { control: false },
    onAppear: { control: false },
    onDisappear: { control: false },
  },
  render: (args) => (
    <NativeStoryFrame {...args}>
      <FieldGroupDemo key={`${args.notifications}-${args.accepted}-${args.volume}`} {...args} />
    </NativeStoryFrame>
  ),
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof FieldGroupDemo>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Preferences: Story = {};
export const CustomHeader: Story = { args: { customHeader: true } };
export const Disabled: Story = { args: { disabled: true } };
export const LightTheme: Story = { args: { colorScheme: 'light' } };
