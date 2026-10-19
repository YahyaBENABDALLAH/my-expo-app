import type { Meta, StoryObj } from '@storybook/react-native';
import { ScrollView, UniversalHost } from '@components/ui';
import { useThemeColors } from '@/hooks/use-theme';
import { HomeCatalogSections } from '@/features/recipes/home-catalog-sections';

const images = [
  require('@assets/images/recipe-examples/breakfast.jpg'),
  require('@assets/images/recipe-examples/salad.jpg'),
  require('@assets/images/recipe-examples/pasta.jpg'),
];

function HomeCatalogStory({ colorScheme }: { colorScheme: 'light' | 'dark' }) {
  const colors = useThemeColors(colorScheme);
  return (
    <UniversalHost
      colorScheme={colorScheme}
      matchContents={false}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <ScrollView direction="vertical" showsIndicators={false}>
        <HomeCatalogSections images={images} />
      </ScrollView>
    </UniversalHost>
  );
}

const meta = {
  title: 'Recipes/Home catalog',
  component: HomeCatalogStory,
  args: { colorScheme: 'light' },
} satisfies Meta<typeof HomeCatalogStory>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Light: Story = {};
export const Dark: Story = { args: { colorScheme: 'dark' } };
