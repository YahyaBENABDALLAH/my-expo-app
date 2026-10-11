import { useTranslation } from 'react-i18next';
import {
  BottomSheet,
  Column,
  Row,
  ScrollView,
  Picker,
  UniversalButtonContent,
  PageScreen,
  UniversalTextContent as Text,
  SearchField,
  QueryContent,
  RecipeCard,
  nativeFillWidth,
  nativeRowWeight,
} from '@components/ui';
import { useQuery } from '@tanstack/react-query';
import { router, useIsFocused, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState, type PropsWithChildren } from 'react';
import { Keyboard, useWindowDimensions } from 'react-native';
import { useScreenRefresh } from '@/hooks/use-screen-refresh';
import { useRegisterTabAction } from '@/features/pages/tab-actions';
import { lookupLabel, lookupOptions, recipeListOptions } from './queries';
import { openRecipe } from './recipe-navigation';

type SearchParams = {
  q?: string | string[];
  focus?: string | string[];
  categoryUuid?: string | string[];
  cuisineUuid?: string | string[];
  difficultyUuid?: string | string[];
};
type SearchFilters = Record<'categoryUuid' | 'cuisineUuid' | 'difficultyUuid', string>;
const emptyFilters: SearchFilters = { categoryUuid: '', cuisineUuid: '', difficultyUuid: '' };

function single(value: string | string[] | undefined) {
  return typeof value === 'string' ? value.trim() : '';
}

/** Resizing the filter viewport does not rebuild the search/results screen. */
function SearchFilterViewport({ children }: PropsWithChildren) {
  const { height } = useWindowDimensions();
  return (
    <ScrollView style={{ height: Math.min(600, height * 0.7) }} testID="search-filter-scroll">
      {children}
    </ScrollView>
  );
}

export default function SearchScreen() {
  const params = useLocalSearchParams<SearchParams>();
  return <SearchContent params={params} />;
}

function SearchContent({ params }: { params: SearchParams }) {
  const { t } = useTranslation();
  const focused = useIsFocused();
  const [text, setText] = useState(single(params.q));
  const [search, setSearch] = useState(text);
  const [previousRouteSearch, setPreviousRouteSearch] = useState(text);
  const routeSearch = single(params.q);
  // Sync an external deep link before rendering children, preserving the native field.
  if (previousRouteSearch !== routeSearch) {
    setPreviousRouteSearch(routeSearch);
    setText(routeSearch);
    setSearch(routeSearch);
  }
  const categoryUuid = single(params.categoryUuid);
  const cuisineUuid = single(params.cuisineUuid);
  const difficultyUuid = single(params.difficultyUuid);
  const filters = { categoryUuid, cuisineUuid, difficultyUuid };
  const filterCount = Object.values(filters).filter(Boolean).length;
  const criteriaKey = JSON.stringify([search, categoryUuid, cuisineUuid, difficultyUuid]);
  const [pagination, setPagination] = useState({ criteriaKey, page: 1 });
  const page = pagination.criteriaKey === criteriaKey ? pagination.page : 1;
  const setPage = (page: number) => setPagination({ criteriaKey, page });
  const [sheet, setSheet] = useState(false);
  const [draftFilters, setDraftFilters] = useState<SearchFilters>(filters);
  const openFilters = useCallback(() => {
    Keyboard.dismiss();
    setDraftFilters({ categoryUuid, cuisineUuid, difficultyUuid });
    setSheet(true);
  }, [categoryUuid, cuisineUuid, difficultyUuid]);
  useEffect(() => {
    const nextSearch = text.trim();
    if (nextSearch === search) return;
    const timer = setTimeout(() => {
      setSearch(nextSearch);
      setPagination((current) => ({ ...current, page: 1 }));
    }, 300);
    return () => clearTimeout(timer);
  }, [text, search]);
  useRegisterTabAction('search', {
    kind: filterCount ? 'active-filters' : 'filters',
    label: filterCount ? t('search.openActiveFilters') : t('search.openFilters'),
    onPress: openFilters,
  });
  const categoryOptions = lookupOptions('FoodCategory');
  const cuisineOptions = lookupOptions('Cuisine');
  const difficultyOptions = lookupOptions('Difficulty');
  const categories = useQuery({ ...categoryOptions, enabled: focused && sheet });
  const cuisines = useQuery({ ...cuisineOptions, enabled: focused && sheet });
  const difficulties = useQuery({ ...difficultyOptions, enabled: focused && sheet });
  const options = recipeListOptions({ page, pageSize: 12, search, ...filters });
  const query = useQuery({ ...options, enabled: focused });
  const onRefresh = useScreenRefresh([
    options.queryKey,
    ...(sheet
      ? [categoryOptions.queryKey, cuisineOptions.queryKey, difficultyOptions.queryKey]
      : []),
  ]);
  const empty = query.isSuccess && query.data.data.length === 0;

  return (
    <PageScreen
      title={t('common.search')}
      onRefresh={onRefresh}
      description={t('search.description')}
      tab
      headerAction={
        single(params.focus)
          ? {
              label: t('auth.cancel'),
              testID: 'search-cancel',
              onPress: () => {
                Keyboard.dismiss();
                router.navigate('/');
              },
            }
          : undefined
      }
      headerAccessory={
        <SearchField
          mode="edit"
          placeholder={t('search.recipes')}
          testID="recipe-search-input"
          value={text}
          onChange={setText}
          clearLabel={t('common.clear')}
          active={focused}
          focusRequest={single(params.focus)}
          onSubmit={(value) => {
            setSearch(value.trim());
            setPage(1);
            Keyboard.dismiss();
          }}
        />
      }
    >
      <Row spacing={12} alignment="center" modifiers={nativeFillWidth}>
        <Column modifiers={nativeRowWeight}>
          {query.isSuccess ? (
            <Text variant="caption" testID="search-result-count">
              {t('search.resultCount', { count: query.data.meta.itemCount })}
            </Text>
          ) : null}
        </Column>
        <UniversalButtonContent
          variant="secondary"
          label={
            filterCount ? t('search.activeFilters', { count: filterCount }) : t('search.filters')
          }
          testID="search-filters"
          onPress={openFilters}
        />
      </Row>
      <QueryContent query={query} empty={empty} emptyMessage={t('search.noResults')}>
        {query.data?.data.map((recipe) => (
          <RecipeCard key={recipe.uuid} recipe={recipe} onPress={openRecipe} />
        ))}
      </QueryContent>
      {empty && (search || filterCount) ? (
        <UniversalButtonContent
          variant="secondary"
          label={t('search.resetSearch')}
          testID="search-reset"
          onPress={() => {
            setText('');
            setSearch('');
            router.setParams({ ...emptyFilters, q: '' });
            setPage(1);
          }}
        />
      ) : null}
      {query.data && (page > 1 || query.data.meta.hasNextPage) ? (
        <Column spacing={8} modifiers={nativeFillWidth}>
          <Text variant="caption">{t('common.page', { page })}</Text>
          <Row spacing={12} alignment="center" modifiers={nativeFillWidth}>
            <UniversalButtonContent
              variant="secondary"
              label={t('common.previousPage')}
              testID="search-previous-page"
              disabled={page === 1 || query.isFetching}
              onPress={() => setPage(page - 1)}
            />
            <UniversalButtonContent
              variant="secondary"
              label={t('common.nextPage')}
              testID="search-next-page"
              disabled={!query.data.meta.hasNextPage || query.isFetching}
              onPress={() => setPage(page + 1)}
            />
          </Row>
        </Column>
      ) : null}
      <BottomSheet isPresented={sheet} onDismiss={() => setSheet(false)}>
        <SearchFilterViewport>
          <Column spacing={16} modifiers={nativeFillWidth}>
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
              <Column key={key} spacing={8} modifiers={nativeFillWidth}>
                <Text>{label}</Text>
                <QueryContent query={lookup}>
                  <Picker
                    testID={`search-filter-${key}`}
                    selectedValue={draftFilters[key]}
                    onValueChange={(value) =>
                      setDraftFilters((current) => ({ ...current, [key]: String(value) }))
                    }
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
              variant="link"
              fullWidth
              label={t('search.clearFilters')}
              testID="search-clear-filters"
              onPress={() => setDraftFilters(emptyFilters)}
            />
            <UniversalButtonContent
              variant="primary"
              label={t('search.applyFilters')}
              testID="search-filter-done"
              fullWidth
              onPress={() => {
                router.setParams(draftFilters);
                setPage(1);
                setSheet(false);
              }}
            />
            <UniversalButtonContent
              variant="link"
              fullWidth
              label={t('auth.cancel')}
              testID="search-filter-cancel"
              onPress={() => setSheet(false)}
            />
          </Column>
        </SearchFilterViewport>
      </BottomSheet>
    </PageScreen>
  );
}
