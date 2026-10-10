import type { Meta, StoryObj } from '@storybook/react-native';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { ComponentScreen } from '@/features/ui-showcase/component-screen';
import { componentPages } from '@/features/ui-showcase/catalog';
import { ThemePreferencesProvider } from '@/context/theme.context';
import { LayoutDirectionProvider } from '@/context/layout-direction.context';

function Gallery({ name }: { name: string }) {
  return (
    <SafeAreaInsetsContext.Provider value={{ top: 0, bottom: 0, left: 0, right: 0 }}>
      <LayoutDirectionProvider initialDirection="ltr">
        <ThemePreferencesProvider initialColorScheme="light">
          <ComponentScreen name={name} />
        </ThemePreferencesProvider>
      </LayoutDirectionProvider>
    </SafeAreaInsetsContext.Provider>
  );
}

const meta = {
  title: 'Pages/Component pages',
  component: Gallery,
  args: { name: 'switch' },
  argTypes: { name: { control: 'select', options: componentPages.map((page) => page.name) } },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Gallery>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Switch: Story = {};
export const Buttons: Story = { args: { name: 'buttons' } };
export const Input: Story = { args: { name: 'input' } };
export const Checkbox: Story = { args: { name: 'checkbox' } };
export const Slider: Story = { args: { name: 'slider' } };
export const Picker: Story = { args: { name: 'picker' } };
export const Segments: Story = { args: { name: 'segments' } };
export const Collapsible: Story = { args: { name: 'collapsible' } };
export const List: Story = { args: { name: 'list' } };
export const Tokens: Story = { args: { name: 'tokens' } };
