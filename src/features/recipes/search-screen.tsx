import { useTranslation } from 'react-i18next';
import {
  BottomSheet,
  Column,
  Picker,
  UniversalButtonContent,
  PageScreen,
  UniversalTextContent as Text,
  NativeField,
  QueryContent,
  RecipeCard,
} from '@components/ui';
import { useQuery } from '@tanstack/react-query';
import { router, useIsFocused, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

import { useScreenRefresh } from '@/hooks/use-screen-refresh';
import { useTabActions } from '@/features/pages/tab-actions';

import { lookupLabel, lookupOptions, recipeListOptions } from './queries';

function single(value: string | string[] | undefined) {
  return typeof value === 'string' ? value : '';
}

export default function SearchScreen() {
  const params = useLocalSearchParams<{
    q?: string;
    categoryUuid?: string;
    cuisineUuid?: string;
    difficultyUuid?: string;
  }>();
  const key = single(params.q);
  return <SearchContent key={key} params={params} />;
}

function SearchContent({
  params,
}: {
  params: { q?: string; categoryUuid?: string; cuisineUuid?: string; difficultyUuid?: string };
}) {
  const { t } = useTranslation();
  const focused = useIsFocused();
  const [text, setText] = useState(single(params.q));
  const [search, setSearch] = useState(text);
  const filters = {
    categoryUuid: single(params.categoryUuid),
    cuisineUuid: single(params.cuisineUuid),
    difficultyUuid: single(params.difficultyUuid),
  };
  const filterValues = Object.values(filters);
  const activeFilters = filterValues.filter(Boolean);
  const filterKey = filterValues.join('\u0000');
  const [pagination, setPagination] = useState({ filterKey, page: 1 });
  const page = pagination.filterKey === filterKey ? pagination.page : 1;
  const setPage = useCallback((page: number) => setPagination({ filterKey, page }), [filterKey]);
  const [sheet, setSheet] = useState(false);
  const filtersActive = activeFilters.length > 0;
  const { setAction } = useTabActions();
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(text.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [text, setPage]);
  useEffect(() => {
    setAction('search', {
      kind: filtersActive ? 'active-filters' : 'filters',
      label: filtersActive ? t('search.openActiveFilters') : t('search.openFilters'),
      onPress: () => setSheet(true),
    });
    return () => setAction('search', undefined);
  }, [setAction, filtersActive, t]);
  const categoryOptions = lookupOptions('FoodCategory');
  const cuisineOptions = lookupOptions('Cuisine');
  const difficultyOptions = lookupOptions('Difficulty');
  const categories = useQuery({ ...categoryOptions, enabled: focused });
  const cuisines = useQuery({ ...cuisineOptions, enabled: sheet });
  const difficulties = useQuery({ ...difficultyOptions, enabled: sheet });
  const options = recipeListOptions({
    page,
    pageSize: 12,
    search,
    ...filters,
  });
  const query = useQuery({ ...options, enabled: focused });
  const onRefresh = useScreenRefresh([
    options.queryKey,
    categoryOptions.queryKey,
    ...(sheet ? [cuisineOptions.queryKey, difficultyOptions.queryKey] : []),
  ]);
  return (
    <PageScreen
      title={t('common.search')}
      onRefresh={onRefresh}
      description={
        filtersActive
          ? t('search.filtered', { filters: activeFilters.join(', ') })
          : t('search.description')
      }
      tab
    >
      <NativeField
        label={t('search.recipes')}
        testID="recipe-search-input"
        value={text}
        onChange={setText}
      />
      <UniversalButtonContent
        variant="secondary"
        label={t('search.filters')}
        testID="search-filters"
        onPress={() => setSheet(true)}
      />
      <QueryContent query={query} empty={query.data?.data.length === 0}>
        {query.data?.data.map((recipe) => (
          <RecipeCard key={recipe.uuid} recipe={recipe} />
        ))}
      </QueryContent>
      <UniversalButtonContent
        variant="secondary"
        label={t('common.previousPage')}
        disabled={page === 1 || query.isFetching}
        onPress={() => setPage(page - 1)}
      />
      <Text>{t('common.page', { page })}</Text>
      <UniversalButtonContent
        variant="secondary"
        label={t('common.nextPage')}
        disabled={!query.data?.meta.hasNextPage || query.isFetching}
        onPress={() => setPage(page + 1)}
      />
      <BottomSheet isPresented={sheet} onDismiss={() => setSheet(false)}>
        <Column spacing={12} style={{ padding: 20 }}>
          <Text variant="title" testID="search-filter-title">
            {t('search.filterTitle')}
          </Text>
          {(
            [
              ['categoryUuid', t('common.category'), categories],
              ['cuisineUuid', t('common.cuisine'), cuisines],
              ['difficultyUuid', t('common.difficulty'), difficulties],
            ] as const
          ).map(([key, label, lookup]) => (
            <Column key={key} spacing={8}>
              <Text>{label}</Text>
              <QueryContent query={lookup}>
                <Picker
                  selectedValue={filters[key]}
                  onValueChange={(value) => {
                    router.setParams({ [key]: String(value) });
                    setPage(1);
                  }}
                >
                  <Picker.Item value="" label={t('common.all')} />
                  {lookup.data?.data.map((item) => (
                    <Picker.Item key={item.uuid} value={item.uuid} label={lookupLabel(item)} />
                  ))}
                </Picker>
              </QueryContent>
            </Column>
          ))}
          <UniversalButtonContent
            variant="secondary"
            label={t('search.clearFilters')}
            onPress={() =>
              router.setParams({ categoryUuid: '', cuisineUuid: '', difficultyUuid: '' })
            }
          />
          <UniversalButtonContent
            variant="primary"
            label={t('common.done')}
            testID="search-filter-done"
            onPress={() => setSheet(false)}
          />
        </Column>
      </BottomSheet>
    </PageScreen>
  );
}
