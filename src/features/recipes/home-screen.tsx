import { useTranslation } from 'react-i18next';
import {
  Column,
  Row,
  ScrollView,
  UniversalButtonContent,
  PageScreen,
  UniversalTextContent as Text,
  QueryContent,
  RecipeCard,
  nativeFillWidth,
  nativeRowWeight,
} from '@components/ui';
import { useQuery } from '@tanstack/react-query';
import { router, useIsFocused } from 'expo-router';
import { useScreenRefresh } from '@/hooks/use-screen-refresh';
import { lookupLabel, lookupOptions, recipeListOptions } from './queries';
import { openRecipe } from './recipe-navigation';
import { HomeCardExamples } from './home-card-examples';
import { HomeRecipeSkeletons } from './home-recipe-skeletons';

export default function HomeScreen() {
  const { t } = useTranslation();
  const focused = useIsFocused();
  const categoryOptions = lookupOptions('FoodCategory');
  const recipeOptions = recipeListOptions({ pageSize: 8 });
  const categories = useQuery({ ...categoryOptions, enabled: focused });
  const recipes = useQuery({ ...recipeOptions, enabled: focused });
  const onRefresh = useScreenRefresh([categoryOptions.queryKey, recipeOptions.queryKey]);
  return (
    <PageScreen
      title={t('common.home')}
      description={t('home.description')}
      tab
      onRefresh={onRefresh}
    >
      <UniversalButtonContent
        label={t('home.search')}
        variant="primary"
        testID="home-search"
        fullWidth
        onPress={() => router.navigate('/search')}
      />
      <HomeCardExamples editorialScroll={false} />
      <Text variant="title">{t('home.categories')}</Text>
      <QueryContent query={categories} empty={categories.data?.data.length === 0}>
        <ScrollView direction="horizontal">
          <Row spacing={8}>
            {categories.data?.data.map((category) => (
              <UniversalButtonContent
                key={category.uuid}
                label={lookupLabel(category)}
                variant="secondary"
                onPress={() =>
                  router.push({ pathname: '/category/[uuid]', params: { uuid: category.uuid } })
                }
              />
            ))}
          </Row>
        </ScrollView>
      </QueryContent>
      <Row spacing={12} alignment="center" modifiers={nativeFillWidth}>
        <Column modifiers={nativeRowWeight}>
          <Text variant="title">{t('home.discover')}</Text>
        </Column>
        <UniversalButtonContent
          label={t('home.viewAll')}
          variant="link"
          onPress={() => router.navigate('/search')}
        />
      </Row>
      {focused && recipes.data === undefined && recipes.fetchStatus === 'fetching' ? (
        <HomeRecipeSkeletons animate={focused} />
      ) : null}
      <QueryContent
        query={recipes}
        empty={recipes.data?.data.length === 0}
        emptyMessage={t('home.empty')}
      >
        <Column spacing={12}>
          {recipes.data?.data.map((recipe) => (
            <RecipeCard key={recipe.uuid} recipe={recipe} onPress={openRecipe} />
          ))}
        </Column>
      </QueryContent>
    </PageScreen>
  );
}
