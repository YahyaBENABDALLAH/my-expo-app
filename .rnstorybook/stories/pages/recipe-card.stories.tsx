import { useCallback, useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native';
import { action } from 'storybook/actions';
import {
  Column,
  RecipeCard,
  ScrollView,
  UniversalButtonContent,
  UniversalHost,
  UniversalTextContent as Text,
} from '@components/ui';
import type { RecipeCardData } from '@/types/recipe.types';

// Embedded artwork keeps the visual fixture independent of network requests.
const coverImageUrl = `data:image/svg+xml;utf8,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="260" height="160"><rect width="260" height="160" fill="#275e48"/><circle cx="130" cy="80" r="54" fill="#f5dcc0"/><circle cx="130" cy="80" r="36" fill="#d49b55"/></svg>',
)}`;

const example: RecipeCardData = {
  uuid: 'storybook-recipe',
  title: 'Vegetable couscous',
  coverImageUrl: null,
  totalTimeMinutes: 45,
  difficultyName: 'Easy',
  likesCount: 17,
  chefDisplayName: 'Storybook chef',
};

function CardStory({
  colorScheme,
  withImage = false,
  longTitle = false,
}: {
  colorScheme: 'light' | 'dark';
  withImage?: boolean;
  longTitle?: boolean;
}) {
  const [parentUpdates, setParentUpdates] = useState(0);
  const [likes, setLikes] = useState(example.likesCount);
  const [presses, setPresses] = useState(0);
  const onPress = useCallback((uuid: string) => {
    setPresses((value) => value + 1);
    action('recipe card pressed')(uuid);
  }, []);
  const recipe = useMemo(
    () => ({
      ...example,
      title: longTitle
        ? 'Vegetable couscous with roasted seasonal vegetables and fresh herbs'
        : example.title,
      coverImageUrl: withImage ? coverImageUrl : null,
      likesCount: likes,
    }),
    [withImage, longTitle, likes],
  );
  return (
    <UniversalHost colorScheme={colorScheme} matchContents={false} style={{ flex: 1 }}>
      <ScrollView>
        <Column spacing={16} style={{ padding: 24 }}>
          <RecipeCard recipe={recipe} onPress={onPress} />
          <Text testID="recipe-card-press-count">{`Presses: ${presses}`}</Text>
          <Text testID="recipe-card-parent-updates">{`Parent updates: ${parentUpdates}`}</Text>
          <UniversalButtonContent
            variant="secondary"
            testID="recipe-card-update-parent"
            label="Update parent"
            onPress={() => setParentUpdates((value) => value + 1)}
          />
          <UniversalButtonContent
            variant="secondary"
            testID="recipe-card-update-likes"
            label="Add a like"
            onPress={() => setLikes((value) => value + 1)}
          />
          <Text variant="caption">Card activation updates the count and logs its UUID.</Text>
        </Column>
      </ScrollView>
    </UniversalHost>
  );
}

const meta = {
  title: 'Recipes/Compact recipe card',
  component: CardStory,
  args: { colorScheme: 'light', withImage: false, longTitle: false },
  argTypes: {
    colorScheme: { control: 'select', options: ['light', 'dark'] },
    withImage: { control: 'boolean' },
    longTitle: { control: 'boolean' },
  },
} satisfies Meta<typeof CardStory>;
export default meta;

type Story = StoryObj<typeof meta>;
export const Light: Story = {};
export const Dark: Story = { args: { colorScheme: 'dark' } };
export const WithImage: Story = { args: { withImage: true } };
export const LongTitle: Story = { args: { longTitle: true } };
