import { useTranslation } from 'react-i18next';
import {
  UniversalButtonContent,
  PageScreen,
  UniversalTextContent as Text,
  TextInput,
  QueryContent,
  RecipeCard,
} from '@components/ui';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

import { useScreenRefresh } from '@/hooks/use-screen-refresh';
import { isValidRouteIdentifier } from '@/lib/route-identifier';

import { lookupLabel, lookupOptions, recipeListOptions } from './queries';
import { openRecipe } from './recipe-navigation';

export function CategoryScreen() {
  const { t } = useTranslation();
  const { uuid } = useLocalSearchParams<{ uuid?: string }>();
  const valid = isValidRouteIdentifier(uuid);
  const options = recipeListOptions({ categoryUuid: uuid });
  const query = useQuery({ ...options, enabled: valid });
  const onRefresh = useScreenRefresh([options.queryKey]);
  return (
    <PageScreen
      title={valid ? t('common.category') : t('recipes.invalidCategory')}
      description={t('recipes.categoryDescription')}
      onRefresh={valid ? onRefresh : undefined}
      actions={[
        {
          label: t('search.recipes'),
          testID: 'page-action-search-recipes',
          href: { pathname: '/search', params: { categoryUuid: valid ? uuid : '' } },
        },
      ]}
    >
      {valid ? (
        <QueryContent query={query} empty={query.data?.data.length === 0}>
          {query.data?.data.map((recipe) => (
            <RecipeCard key={recipe.uuid} recipe={recipe} onPress={openRecipe} />
          ))}
        </QueryContent>
      ) : null}
    </PageScreen>
  );
}

export function IngredientsScreen() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const options = lookupOptions('Ingredient', page, search);
  const query = useQuery(options);
  const onRefresh = useScreenRefresh([options.queryKey]);
  return (
    <PageScreen
      title={t('common.ingredients')}
      description={t('recipes.ingredientDescription')}
      onRefresh={onRefresh}
    >
      <TextInput
        label={t('recipes.searchIngredients')}
        testID="ingredients-search"
        value={search}
        onChangeText={(value) => {
          setSearch(value);
          setPage(1);
        }}
      />
      <QueryContent query={query}>
        {query.data?.data.map((item) => (
          <Text key={item.uuid}>{lookupLabel(item)}</Text>
        ))}
      </QueryContent>
      <UniversalButtonContent
        variant="secondary"
        label={t('common.previousPage')}
        disabled={page === 1}
        onPress={() => setPage(page - 1)}
      />
      <UniversalButtonContent
        variant="secondary"
        label={t('common.nextPage')}
        disabled={!query.data?.meta.hasNextPage}
        onPress={() => setPage(page + 1)}
      />
    </PageScreen>
  );
}
