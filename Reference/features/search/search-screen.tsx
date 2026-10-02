import { Icon, icons } from "@/components/Universal/icon";
import { TextInput, useNativeState } from "@/components/Universal/text-input";
import { useCreateRecipeContext } from "@/context/create-recipe.context";
import { useTheme } from "@/context/theme.context";
import { SearchCategoryBrowser } from "@/features/search/components/search-category-browser";
import {
  SearchFilterSheet,
  type SearchFilterSelection,
} from "@/features/search/components/search-filter-sheet";
import { SearchResultsList } from "@/features/search/components/search-results-list";
import { TAB_BAR_HEIGHT, TAB_BAR_MARGIN } from "@/constants/app.constant";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { getSingleRouteParam } from "@/lib/route-params";
import { useCuisineListQuery } from "@/services/cuisine/cuisine.queries";
import { useDifficultyListQuery } from "@/services/difficulty/difficulty.queries";
import { useFoodCategoryListQuery } from "@/services/food-category/food-category.queries";
import { useRecipeListQuery } from "@/services/recipe/recipe.queries";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Keyboard, View } from "react-native";

const EMPTY_FILTERS: SearchFilterSelection = {};

export default function SearchScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const routeParams = useLocalSearchParams<{
    categoryUuid?: string | string[];
    cuisineUuid?: string | string[];
    difficultyUuid?: string | string[];
    q?: string | string[];
  }>();
  const routeQuery = getSingleRouteParam(routeParams.q) ?? "";
  const routeCategoryUuid = getSingleRouteParam(routeParams.categoryUuid);
  const routeCuisineUuid = getSingleRouteParam(routeParams.cuisineUuid);
  const routeDifficultyUuid = getSingleRouteParam(routeParams.difficultyUuid);
  const routeFingerprint = [
    routeQuery,
    routeCategoryUuid,
    routeCuisineUuid,
    routeDifficultyUuid,
  ].join("\u0000");
  const appliedRouteFingerprint = useRef<string | undefined>(undefined);
  const {
    onOpenSearchFiltersRef,
    onResetSearchFiltersRef,
    setIsSearchFilterActive,
  } = useCreateRecipeContext();
  const [searchText, setSearchText] = useState(routeQuery);
  const searchInputValue = useNativeState(routeQuery);
  const debouncedSearchText = useDebouncedValue(searchText, 300).trim();
  const [filters, setFilters] = useState<SearchFilterSelection>(() => ({
    categoryUuid: routeCategoryUuid,
    cuisineUuid: routeCuisineUuid,
    difficultyUuid: routeDifficultyUuid,
  }));
  const [draftFilters, setDraftFilters] =
    useState<SearchFilterSelection>(() => ({
      categoryUuid: routeCategoryUuid,
      cuisineUuid: routeCuisineUuid,
      difficultyUuid: routeDifficultyUuid,
    }));
  const [isFilterSheetVisible, setIsFilterSheetVisible] = useState(false);

  const hasFilters = Boolean(
    filters.categoryUuid || filters.cuisineUuid || filters.difficultyUuid,
  );
  const hasActiveQuery = searchText.trim().length > 0 || hasFilters;
  const hasDebouncedActiveQuery = debouncedSearchText.length > 0 || hasFilters;

  const recipesQuery = useRecipeListQuery(
    {
      categoryUuid: filters.categoryUuid,
      cuisineUuid: filters.cuisineUuid,
      difficultyUuid: filters.difficultyUuid,
      page: 1,
      pageSize: 20,
      search: debouncedSearchText || undefined,
    },
    { enabled: hasDebouncedActiveQuery },
  );
  const categoriesQuery = useFoodCategoryListQuery({ isActive: true, pageSize: 50 });
  const cuisinesQuery = useCuisineListQuery(
    { isActive: true, pageSize: 50 },
    { enabled: isFilterSheetVisible },
  );
  const difficultiesQuery = useDifficultyListQuery(
    { isActive: true, pageSize: 50 },
    { enabled: isFilterSheetVisible },
  );

  const closeFilters = useCallback(() => {
    setIsFilterSheetVisible(false);
    Keyboard.dismiss();
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters(EMPTY_FILTERS);
    setDraftFilters(EMPTY_FILTERS);
    router.setParams({
      categoryUuid: undefined,
      cuisineUuid: undefined,
      difficultyUuid: undefined,
    });
    closeFilters();
  }, [closeFilters, router]);

  const openFilters = useCallback(() => {
    setDraftFilters(filters);
    setIsFilterSheetVisible(true);
    Keyboard.dismiss();
  }, [filters]);

  const applyFilters = useCallback(() => {
    setFilters(draftFilters);
    router.setParams({
      categoryUuid: draftFilters.categoryUuid,
      cuisineUuid: draftFilters.cuisineUuid,
      difficultyUuid: draftFilters.difficultyUuid,
    });
    closeFilters();
  }, [closeFilters, draftFilters, router]);

  useEffect(() => {
    if (appliedRouteFingerprint.current === routeFingerprint) {
      return;
    }

    appliedRouteFingerprint.current = routeFingerprint;
    const routeFilters = {
      categoryUuid: routeCategoryUuid,
      cuisineUuid: routeCuisineUuid,
      difficultyUuid: routeDifficultyUuid,
    };

    searchInputValue.set(routeQuery);
    setSearchText(routeQuery);
    setFilters(routeFilters);
    setDraftFilters(routeFilters);
  }, [
    routeCategoryUuid,
    routeCuisineUuid,
    routeDifficultyUuid,
    routeFingerprint,
    routeQuery,
    searchInputValue,
  ]);

  useEffect(() => {
    if (debouncedSearchText === routeQuery) {
      return;
    }

    router.setParams({ q: debouncedSearchText || undefined });
  }, [debouncedSearchText, routeQuery, router]);

  useEffect(() => {
    setIsSearchFilterActive(hasFilters);
    return () => setIsSearchFilterActive(false);
  }, [hasFilters, setIsSearchFilterActive]);

  useEffect(() => {
    onOpenSearchFiltersRef.current = openFilters;
    onResetSearchFiltersRef.current = clearAllFilters;
    return () => {
      onOpenSearchFiltersRef.current = null;
      onResetSearchFiltersRef.current = null;
    };
  }, [clearAllFilters, onOpenSearchFiltersRef, onResetSearchFiltersRef, openFilters]);

  const recipes = recipesQuery.data?.data ?? [];
  const categories = categoriesQuery.data?.data ?? [];
  const cuisines = cuisinesQuery.data?.data ?? [];
  const difficulties = difficultiesQuery.data?.data ?? [];
  const isLoading = recipesQuery.isPending || recipesQuery.isPlaceholderData;
  const isRefetching = recipesQuery.isFetching && !isLoading;

  return (
    <View style={{ backgroundColor: "transparent", flex: 1, paddingTop: 16 }}>
      <View style={{ paddingBottom: 8, paddingHorizontal: 16 }}>
        <TextInput
          containerStyle={{ width: "100%" }}
          value={searchInputValue}
          returnKeyType="search"
          onChangeText={setSearchText}
          placeholder="Find recipes, chefs, or ingredients..."
          autoCapitalize="none"
          leftIcon={<Icon name={icons.search} size={24} color={colors.primary} />}
        />
      </View>

      <SearchFilterSheet
        categories={categories}
        categoriesError={categoriesQuery.isError}
        categoriesLoading={categoriesQuery.isPending}
        categoriesRetrying={categoriesQuery.isFetching}
        cuisines={cuisines}
        cuisinesError={cuisinesQuery.isError}
        cuisinesLoading={cuisinesQuery.isPending}
        cuisinesRetrying={cuisinesQuery.isFetching}
        difficulties={difficulties}
        difficultiesError={difficultiesQuery.isError}
        difficultiesLoading={difficultiesQuery.isPending}
        difficultiesRetrying={difficultiesQuery.isFetching}
        onApply={applyFilters}
        onDismiss={closeFilters}
        onRetryCategories={categoriesQuery.refetch}
        onRetryCuisines={cuisinesQuery.refetch}
        onRetryDifficulties={difficultiesQuery.refetch}
        onReset={clearAllFilters}
        onSelectionChange={setDraftFilters}
        selection={draftFilters}
        visible={isFilterSheetVisible}
      />

      {hasActiveQuery ? (
        <SearchResultsList
          isError={recipesQuery.isError}
          isLoading={isLoading}
          isRefetching={isRefetching}
          isRetrying={recipesQuery.isFetching}
          onRetry={recipesQuery.refetch}
          onSelect={(uuid) => router.push(`/recipe/${uuid}`)}
          paddingBottom={TAB_BAR_HEIGHT + TAB_BAR_MARGIN}
          recipes={recipes}
        />
      ) : (
        <SearchCategoryBrowser
          categories={categories}
          isError={categoriesQuery.isError}
          isLoading={categoriesQuery.isPending}
          isRetrying={categoriesQuery.isFetching}
          onRetry={categoriesQuery.refetch}
          paddingBottom={TAB_BAR_HEIGHT + TAB_BAR_MARGIN}
          onSelect={(categoryUuid) => {
            setFilters({ categoryUuid });
            setDraftFilters({ categoryUuid });
            router.setParams({ categoryUuid });
          }}
        />
      )}
    </View>
  );
}
