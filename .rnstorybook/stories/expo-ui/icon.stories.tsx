import type { Meta, StoryObj } from '@storybook/react-native';
import { action } from 'storybook/actions';
import { NativeStoryFrame, nativeThemeControls } from '../../components/native-story-frame';
import { UniversalIcon } from '@/components/ui/universal-icon';

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
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof UniversalIcon>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Favorite: Story = {};
export const Star: Story = { args: { icon: 'star', accessibilityLabel: 'Star' } };
export const Settings: Story = { args: { icon: 'settings', accessibilityLabel: 'Settings' } };
export const Notifications: Story = {
  args: { icon: 'notifications', accessibilityLabel: 'Notifications' },
};
export const Home: Story = { args: { icon: 'home', accessibilityLabel: 'Home' } };
export const SmallDecorative: Story = { args: { size: 20, onPress: undefined } };
export const Large: Story = { args: { size: 80 } };
export const CustomColor: Story = { args: { color: '#E5AD49' } };
export const Disabled: Story = { args: { disabled: true, style: { opacity: 0.5 } } };
export const Hidden: Story = { args: { hidden: true } };
export const LightTheme: Story = { args: { colorScheme: 'light' } };
export const DarkTheme: Story = { args: { colorScheme: 'dark' } };
