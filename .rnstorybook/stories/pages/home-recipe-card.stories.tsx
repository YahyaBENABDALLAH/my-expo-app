import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useWindowDimensions } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react-native';
import {
  Column,
  HomeRecipeCard,
  ScrollView,
  UniversalHost,
  UniversalTextContent as Text,
} from '@components/ui';
import { homeRecipeExamples } from '@/features/ui-showcase/home-card-examples.data';
import { HomeCardExamples } from '@/features/ui-showcase/home-card-examples';

function CardStory({
  variant,
  colorScheme,
  longTitle = false,
}: {
  variant: 'popular' | 'editorial';
  colorScheme: 'light' | 'dark';
  longTitle?: boolean;
}) {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const [presses, setPresses] = useState(0);
  const examples = homeRecipeExamples(t);
  const item = examples[variant === 'popular' ? 0 : 2];
  const recipe = longTitle ? { ...item, title: `${item.title} — ${item.description}` } : item;
  return (
    <UniversalHost colorScheme={colorScheme} matchContents={false} style={{ flex: 1 }}>
      <ScrollView>
        <Column spacing={16} style={{ padding: 16 }}>
          <HomeRecipeCard
            recipe={recipe}
            variant={variant}
            width={Math.min(variant === 'popular' ? 280 : 480, Math.max(1, width - 32))}
            onPress={() => setPresses((value) => value + 1)}
            testID="story-home-recipe-card"
          />
          <Text testID="story-home-recipe-card-presses">{`Card presses: ${presses}`}</Text>
        </Column>
      </ScrollView>
    </UniversalHost>
  );
}

const meta = {
  title: 'Recipes/Home recipe card',
  component: CardStory,
  args: { variant: 'popular', colorScheme: 'light', longTitle: false },
  argTypes: {
    variant: { control: 'select', options: ['popular', 'editorial'] },
    colorScheme: { control: 'select', options: ['light', 'dark'] },
    longTitle: { control: 'boolean' },
  },
} satisfies Meta<typeof CardStory>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Popular: Story = {};
export const PopularDark: Story = { args: { colorScheme: 'dark' } };
export const Editorial: Story = { args: { variant: 'editorial' } };
export const EditorialDark: Story = { args: { variant: 'editorial', colorScheme: 'dark' } };
export const LongTitle: Story = { args: { longTitle: true } };
export const HorizontalAndVertical: Story = {
  parameters: { controls: { include: ['colorScheme'] } },
  render: ({ colorScheme }) => (
    <UniversalHost colorScheme={colorScheme} matchContents={false} style={{ flex: 1 }}>
      <ScrollView>
        <Column style={{ padding: 24 }}>
          <HomeCardExamples />
        </Column>
      </ScrollView>
    </UniversalHost>
  ),
};
export const HorizontalAndVerticalDark: Story = {
  ...HorizontalAndVertical,
  args: { colorScheme: 'dark' },
};
