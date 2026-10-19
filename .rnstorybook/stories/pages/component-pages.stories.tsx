import type { Meta, StoryObj } from '@storybook/react-native';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { ComponentScreen } from '@/features/ui-showcase/component-screen';
import { componentPages } from '@/features/ui-showcase/catalog';
import { LayoutDirectionProvider } from '@/context/layout-direction.context';

const zeroInsets = { top: 0, bottom: 0, left: 0, right: 0 };

function Gallery({ name }: { name: string }) {
  return (
    <SafeAreaInsetsContext.Provider value={zeroInsets}>
      <LayoutDirectionProvider initialDirection="ltr">
        <ComponentScreen name={name} />
      </LayoutDirectionProvider>
    </SafeAreaInsetsContext.Provider>
  );
}

const meta = {
  title: 'Pages/Component pages',
  component: Gallery,
  args: { name: 'switch' },
  argTypes: { name: { control: 'select', options: componentPages.map((page) => page.name) } },
} satisfies Meta<typeof Gallery>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Switch: Story = {};
export const Buttons: Story = { args: { name: 'buttons' } };
export const Input: Story = { args: { name: 'input' } };
export const Segments: Story = { args: { name: 'segments' } };
