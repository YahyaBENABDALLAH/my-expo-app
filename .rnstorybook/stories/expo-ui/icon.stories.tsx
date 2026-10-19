import { UniversalIcon } from '../../components/showcase/universal-icon';
import type { Meta, StoryObj } from '@storybook/react-native';
import { action } from 'storybook/actions';
import { NativeStoryFrame, nativeThemeControls } from '../../components/native-story-frame';

const meta = {
  title: 'Expo UI/Universal Icon',
  component: UniversalIcon,
  args: {
    testID: 'expo-ui-icon',
    icon: 'favorite',
    size: 44,
    accessibilityLabel: 'Favorite',
    disabled: false,
    hidden: false,
    colorScheme: 'dark',
    onPress: action('icon pressed'),
    onAppear: action('icon appeared'),
    onDisappear: action('icon disappeared'),
  },
  argTypes: {
    ...nativeThemeControls,
    icon: { control: 'select', options: ['favorite', 'star', 'settings', 'notifications', 'home'] },
    size: { control: { type: 'number', min: 12, max: 96 } },
    color: { control: 'color' },
    accessibilityLabel: {
      control: 'text',
      description: 'Android native accessibility label; iOS support is not wired in this SDK.',
    },
    disabled: { control: 'boolean' },
    hidden: { control: 'boolean' },
    style: { control: 'object' },
    onPress: { control: false },
    onAppear: { control: false },
    onDisappear: { control: false },
    modifiers: { control: false },
  },
  render: (args) => (
    <NativeStoryFrame {...args}>
      <UniversalIcon {...args} />
    </NativeStoryFrame>
  ),
} satisfies Meta<typeof UniversalIcon>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Favorite: Story = {};
export const SmallDecorative: Story = { args: { size: 20, onPress: undefined } };
export const Disabled: Story = { args: { disabled: true, style: { opacity: 0.5 } } };
export const LightTheme: Story = { args: { colorScheme: 'light' } };
