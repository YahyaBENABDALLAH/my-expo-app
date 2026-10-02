import type { Meta, StoryObj } from '@storybook/react-native';

import { MonoText } from '@/components/styled-text';

const meta = {
  title: 'Typography/MonoText',
  component: MonoText,
  args: {
    children: 'Likan',
    style: { fontSize: 24 },
  },
} satisfies Meta<typeof MonoText>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Accent: Story = {
  args: {
    lightColor: '#173C65',
    darkColor: '#B8E9FF',
    children: 'Hello from Storybook',
  },
};
