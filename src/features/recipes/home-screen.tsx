import { useTranslation } from 'react-i18next';
import { useThemeColors } from '@/hooks/use-theme';
import {
  Column,
  FieldGroup,
  List,
  ListItem,
  Row,
  ScrollView,
  UniversalButtonContent,
  PageScreen,
  UniversalTextContent as Text,
  QueryContent,
  RecipeCard,
  SkeletonContent,
  Switch,
  nativeFillWidth,
  nativeRowWeight,
  useHostColorScheme,
} from '@components/ui';
import { useQuery } from '@tanstack/react-query';
import { router, useIsFocused } from 'expo-router';
import { useEffect, useState } from 'react';

import { useScreenRefresh } from '@/hooks/use-screen-refresh';

import { lookupLabel, lookupOptions, recipeListOptions } from './queries';
import { HomeCardExamples } from './home-card-examples';

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
      <HomeSkeletonPreview />
      <UniversalButtonContent
        label={t('tools.browsePages')}
        variant="secondary"
        testID="home-browse-pages"
        onPress={() => router.push('/development-pages')}
      />
      <UniversalButtonContent
        label={t('home.search')}
        variant="secondary"
        testID="home-search"
        onPress={() => router.navigate('/search')}
      />
      <HomeCardExamples />
      <HomeComponentExamples />
      <QueryContent query={categories}>
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
      <Text variant="title">{t('home.popular')}</Text>
      <Text variant="caption">{t('home.trending')}</Text>
      <UniversalButtonContent
        label={t('home.viewAll')}
        variant="link"
        onPress={() => router.navigate('/search')}
      />
      <QueryContent query={recipes} empty={recipes.data?.data.length === 0}>
        <ScrollView direction="horizontal">
          <Row spacing={12}>
            {recipes.data?.data.slice(0, 5).map((recipe) => (
              <RecipeCard key={recipe.uuid} recipe={recipe} />
            ))}
          </Row>
        </ScrollView>
        <Text variant="title">{t('home.editorsChoice')}</Text>
        <Column spacing={12}>
          {recipes.data?.data.slice(-3).map((recipe) => (
            <RecipeCard key={recipe.uuid} recipe={recipe} />
          ))}
        </Column>
      </QueryContent>
      <UniversalButtonContent
        variant="secondary"
        label={recipes.isFetching ? t('common.refreshing') : t('common.refresh')}
        disabled={recipes.isFetching || categories.isFetching}
        onPress={() => {
          void onRefresh();
        }}
      />
    </PageScreen>
  );
}

function HomeSkeletonPreview() {
  const { t } = useTranslation();
  const colors = useThemeColors(useHostColorScheme());
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(false), 10_000);
    return () => clearTimeout(timeout);
  }, []);

  if (!visible) return null;

  return (
    <Column spacing={12} modifiers={nativeFillWidth} testID="home-skeleton-preview">
      <Text variant="title" testID="home-skeleton-title">
        {t('showcase.skeleton')}
      </Text>
      <Row spacing={12} alignment="center" modifiers={nativeFillWidth}>
        <SkeletonContent
          animate={false}
          testID="home-skeleton-avatar"
          style={{ width: 48, height: 48, borderRadius: 9999 }}
        />
        <Column spacing={8} modifiers={nativeRowWeight}>
          <SkeletonContent animate={false} testID="home-skeleton-heading" style={{ height: 20 }} />
          <SkeletonContent animate={false} style={{ width: 120, height: 12, borderRadius: 9999 }} />
        </Column>
      </Row>
      <Row
        spacing={8}
        modifiers={nativeFillWidth}
        style={{ backgroundColor: colors.surface, borderRadius: 14, padding: 8 }}
      >
        <SkeletonContent
          animate={false}
          testID="home-skeleton-image"
          style={{ width: 96, height: 96, borderRadius: 14 }}
        />
        <Column spacing={8} modifiers={nativeRowWeight}>
          <SkeletonContent animate={false} style={{ width: 64, height: 12, borderRadius: 9999 }} />
          <SkeletonContent animate={false} style={{ height: 20 }} />
          <SkeletonContent animate={false} style={{ width: 96, height: 20, borderRadius: 9999 }} />
          <Row spacing={12}>
            <SkeletonContent
              animate={false}
              style={{ width: 64, height: 12, borderRadius: 9999 }}
            />
            <SkeletonContent
              animate={false}
              style={{ width: 48, height: 12, borderRadius: 9999 }}
            />
          </Row>
        </Column>
      </Row>
      <SkeletonContent animate={false} testID="home-skeleton-full-width" style={{ height: 16 }} />
    </Column>
  );
}

const exampleMeals = [
  { id: 'toast', name: 'examples.toast', detail: 'examples.toastDetail' },
  { id: 'salad', name: 'examples.salad', detail: 'examples.saladDetail' },
  { id: 'pasta', name: 'examples.pasta', detail: 'examples.pastaDetail' },
];

const cookingTips = [
  'examples.tip1',
  'examples.tip2',
  'examples.tip3',
  'examples.tip4',
  'examples.tip5',
  'examples.tip6',
];

function HomeComponentExamples() {
  const { t } = useTranslation();
  const colors = useThemeColors(useHostColorScheme());
  const [vegetarian, setVegetarian] = useState(false);
  const [quickMeals, setQuickMeals] = useState(true);
  const [selectedMeal, setSelectedMeal] = useState('common.none');

  return (
    <Column spacing={20} modifiers={nativeFillWidth} testID="home-component-examples">
      <Column spacing={8} modifiers={nativeFillWidth}>
        <Text variant="title">{t('showcase.fieldGroup')}</Text>
        {/* Native forms and lists need a bounded height inside the page's scroll view. */}
        <FieldGroup style={{ height: 240 }} modifiers={nativeFillWidth} testID="home-field-group">
          <FieldGroup.Section title={t('showcase.preferences')}>
            <Switch
              label={t('showcase.vegetarian')}
              value={vegetarian}
              onValueChange={setVegetarian}
              modifiers={nativeFillWidth}
              testID="home-vegetarian-switch"
            />
            <Switch
              label={t('showcase.quickMeals')}
              value={quickMeals}
              onValueChange={setQuickMeals}
              modifiers={nativeFillWidth}
              testID="home-quick-meals-switch"
            />
            <FieldGroup.SectionFooter>
              <Text variant="caption">{t('showcase.trySwitches')}</Text>
            </FieldGroup.SectionFooter>
          </FieldGroup.Section>
        </FieldGroup>
      </Column>
      <Column spacing={8} modifiers={nativeFillWidth}>
        <Text variant="title">{t('showcase.listTitle')}</Text>
        <Text variant="caption">{t('showcase.selectMeal')}</Text>
        <Column style={{ height: 240 }} modifiers={nativeFillWidth}>
          <List testID="home-example-list">
            {exampleMeals.map((meal) => (
              <ListItem
                key={meal.id}
                supportingText={t(meal.detail)}
                trailing={selectedMeal === meal.name ? t('common.selected') : undefined}
                onPress={() => setSelectedMeal(meal.name)}
                testID={`home-list-${meal.id}`}
              >
                {t(meal.name)}
              </ListItem>
            ))}
          </List>
        </Column>
        <Text testID="home-list-selection">
          {t('common.selectedValue', { value: t(selectedMeal) })}
        </Text>
      </Column>
      <Column spacing={8} modifiers={nativeFillWidth}>
        <Text variant="title">{t('showcase.horizontal')}</Text>
        <Text variant="caption">{t('showcase.swipeMeals')}</Text>
        <ScrollView
          direction="horizontal"
          style={{ height: 128 }}
          modifiers={nativeFillWidth}
          testID="home-horizontal-scroll"
        >
          <Row spacing={12}>
            {exampleMeals.map((meal) => (
              <Column
                key={meal.id}
                spacing={8}
                style={{
                  width: 200,
                  padding: 16,
                  borderRadius: 14,
                  backgroundColor: colors.surface,
                }}
                testID={`home-horizontal-${meal.id}`}
              >
                <Text fontSize={20} fontWeight="600">
                  {t(meal.name)}
                </Text>
                <Text variant="caption">{t(meal.detail)}</Text>
              </Column>
            ))}
          </Row>
        </ScrollView>
      </Column>
      <Column spacing={8} modifiers={nativeFillWidth}>
        <Text variant="title">{t('showcase.vertical')}</Text>
        <Text variant="caption">{t('showcase.swipeTips')}</Text>
        <ScrollView
          direction="vertical"
          style={{ height: 224 }}
          modifiers={nativeFillWidth}
          testID="home-vertical-scroll"
        >
          <Column spacing={8} modifiers={nativeFillWidth}>
            {cookingTips.map((tip, index) => (
              <Column
                key={t(tip)}
                spacing={4}
                modifiers={nativeFillWidth}
                style={{ padding: 16, borderRadius: 14, backgroundColor: colors.surface }}
                testID={`home-vertical-tip-${index + 1}`}
              >
                <Text fontWeight="600">{t('showcase.tip', { index: index + 1 })}</Text>
                <Text>{t(tip)}</Text>
              </Column>
            ))}
          </Column>
        </ScrollView>
      </Column>
    </Column>
  );
}
