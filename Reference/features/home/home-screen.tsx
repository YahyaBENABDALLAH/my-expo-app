import { EditorsChoiceCard } from "@/components/editors-choice-card";
import { PopularRecipeCard } from "@/components/popular-recipe-card";
import { QueryErrorState } from "@/components/query-error-state";
import { RealisticSkiaFlame } from "@/components/realistic-skia-flame";
import { RecipesEmptyState } from "@/components/recipes-empty-state";
import { SectionHeader } from "@/components/section-header";
import { EditorsChoiceCardSkeleton } from "@/components/skeleton/editors-choice-card-skeleton";
import { PopularRecipeCardSkeleton } from "@/components/skeleton/popular-recipe-card-skeleton";
import { Skeleton } from "@/components/skeleton/skeleton";
import { Host } from "@/components/Universal/host";
import { Icon, icons } from "@/components/Universal/icon";
import { Row } from "@/components/Universal/layout";
import { Text } from "@/components/Universal/text";
import { TextInput } from "@/components/Universal/text-input";
import { CategoryBadge } from "@/components/ui/category-badge";
import { SafePressable } from "@/components/ui/safe-pressable";
import { TAB_BAR_HEIGHT, TAB_BAR_MARGIN } from "@/constants/app.constant";
import { useTheme } from "@/context/theme.context";
import { usePullToRefresh } from "@/hooks/use-pull-to-refresh";
import { useFoodCategoryListQuery } from "@/services/food-category/food-category.queries";
import { useRecipeListQuery } from "@/services/recipe/recipe.queries";
import { Canvas } from "@shopify/react-native-skia";
import { useIsFocused, useRouter } from "expo-router";
import {
    FlatList,
    RefreshControl,
    ScrollView,
    View,
    useWindowDimensions,
} from "react-native";
import { toEditorsChoiceRecipe, toPopularRecipe } from "./home.utils";

const FILTER_SKELETON_WIDTHS = [96, 114, 90, 124] as const;
const RECIPE_PAGE_SIZE = 8;

export function HomeScreen() {
  const router = useRouter();
  const isFocused = useIsFocused();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const popularCardWidth = Math.min(Math.max(width * 0.72, 252), 310);
  const editorsImageHeight = Math.min(Math.max(width * 0.58, 210), 280);

  const categoryFiltersQuery = useFoodCategoryListQuery({
    isActive: true,
    pageSize: 100,
  });
  const recipeListQuery = useRecipeListQuery({
    page: 1,
    pageSize: RECIPE_PAGE_SIZE,
  });

  const categories = categoryFiltersQuery.data?.data ?? [];
  const recipes = recipeListQuery.data?.data ?? [];
  const isCategoryFiltersLoading = categoryFiltersQuery.isPending;
  const isRecipesLoading = recipeListQuery.isPending;
  const hasCategoryInitialError =
    categoryFiltersQuery.isError && categories.length === 0;
  const hasRecipeInitialError = recipeListQuery.isError && recipes.length === 0;
  const popularRecipes = recipes.slice(0, 5).map(toPopularRecipe);
  const editorsChoiceRecipes = recipes.slice(-3).map(toEditorsChoiceRecipe);

  const { isRefreshing, handleRefresh } = usePullToRefresh(async () => {
    await Promise.all([
      categoryFiltersQuery.refetch(),
      recipeListQuery.refetch(),
    ]);
  });

  return (
    <View style={{ flex: 1, backgroundColor: "transparent" }}>
      <ScrollView
        style={{ flex: 1, backgroundColor: "transparent" }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          gap: 16,
          paddingTop: 16,
          paddingBottom: TAB_BAR_HEIGHT + TAB_BAR_MARGIN,
        }}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={{ gap: 16 }}>
          {/* Search Bar — navigates to search tab */}
          <SafePressable
            accessibilityLabel="Open recipe search"
            accessibilityRole="button"
            onPress={() => router.navigate("/(tabs)/search")}
            style={{ paddingHorizontal: 16 }}
          >
            <View pointerEvents="none">
              <TextInput
                placeholder="Find recipes, chefs, or ingredients..."
                autoCapitalize="none"
                leftIcon={<Icon name={icons.search} size={24} color={colors.primary} />}
              />
            </View>
          </SafePressable>

          {/* Category badges — navigate to category/[id] */}
          {hasCategoryInitialError ? (
            <View style={{ paddingHorizontal: 16 }}>
              <QueryErrorState
                compact
                isRetrying={categoryFiltersQuery.isFetching}
                message="We could not load recipe categories."
                onRetry={categoryFiltersQuery.refetch}
              />
            </View>
          ) : (
            <>
              {categoryFiltersQuery.isError ? (
                <View style={{ paddingHorizontal: 16 }}>
                  <QueryErrorState
                    compact
                    isRetrying={categoryFiltersQuery.isFetching}
                    message="Categories could not be refreshed. Showing saved content."
                    onRetry={categoryFiltersQuery.refetch}
                  />
                </View>
              ) : null}
              {isCategoryFiltersLoading ? (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: 16, paddingHorizontal: 16 }}
                >
                  {FILTER_SKELETON_WIDTHS.map((chipWidth, index) => (
                    <Skeleton
                      key={index}
                      style={{
                        minHeight: 40,
                        borderRadius: 9999,
                        width: chipWidth,
                      }}
                    />
                  ))}
                </ScrollView>
              ) : (
                <FlatList
                  horizontal
                  data={categories}
                  keyExtractor={(category) => category.uuid}
                  renderItem={({ item: category }) => (
                    <CategoryBadge
                      name={category.name}
                      iconUrl={category.iconUrl}
                      onPress={() => router.push(`/category/${category.uuid}`)}
                    />
                  )}
                  ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
                  contentContainerStyle={{ paddingHorizontal: 16 }}
                  showsHorizontalScrollIndicator={false}
                />
              )}
            </>
          )}
        </View>

        {/* Popular Recipes */}
        <View style={{ gap: 4 }}>
          <SectionHeader
            title="Popular Recipes"
            description="Trending this week"
            actionLabel="View All"
            onPressAction={() => router.navigate("/(tabs)/search")}
            titleIcon={
              <Canvas style={{ width: 34, height: 42, top: 0 }}>
                <RealisticSkiaFlame
                  animate={isFocused}
                  cx={17}
                  cy={28}
                  sizeScale={0.34}
                />
              </Canvas>
            }
          />

          {recipeListQuery.isError && recipes.length > 0 ? (
            <View style={{ paddingHorizontal: 16 }}>
              <QueryErrorState
                compact
                isRetrying={recipeListQuery.isFetching}
                message="Recipes could not be refreshed. Showing saved content."
                onRetry={recipeListQuery.refetch}
              />
            </View>
          ) : null}

          {hasRecipeInitialError ? (
            <View style={{ paddingHorizontal: 16 }}>
              <QueryErrorState
                isRetrying={recipeListQuery.isFetching}
                message="We could not load recipes for the home screen."
                onRetry={recipeListQuery.refetch}
              />
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                gap: 16,
                paddingHorizontal: 16,
                paddingTop: 8,
              }}
              decelerationRate="fast"
              snapToInterval={popularCardWidth + 16}
              snapToAlignment="center"
            >
              {isRecipesLoading
                ? Array.from({ length: 3 }).map((_, index) => (
                    <PopularRecipeCardSkeleton
                      key={index}
                      width={popularCardWidth}
                    />
                  ))
                : popularRecipes.map((recipe) => (
                    <PopularRecipeCard
                      key={recipe.uuid}
                      item={recipe}
                      width={popularCardWidth}
                      onPress={() => router.push(`/recipe/${recipe.uuid}`)}
                    />
                  ))}
            </ScrollView>
          )}

          {!isRecipesLoading && !hasRecipeInitialError && popularRecipes.length === 0 ? (
            <RecipesEmptyState message="No recipes available right now." />
          ) : null}
        </View>

        {/* Editor's Choice — last 3 recipes */}
        {isRecipesLoading || editorsChoiceRecipes.length > 0 ? (
          <View style={{ gap: 20 }}>
            <Host
              matchContents={{ horizontal: false, vertical: true }}
              useViewportSizeMeasurement
            >
              <Row>
                <Text
                  style={[{ color: colors.secondary }, {
                    fontSize: 30,
                    fontWeight: "600",
                    letterSpacing: -1.2,
                  }]}
                >
                  Editor&apos;s Choice
                </Text>
              </Row>
            </Host>

            <View style={{ gap: 24 }}>
              {isRecipesLoading
                ? Array.from({ length: 2 }).map((_, index) => (
                    <EditorsChoiceCardSkeleton
                      key={index}
                      imageHeight={editorsImageHeight}
                    />
                  ))
                : editorsChoiceRecipes.map((recipe) => (
                    <EditorsChoiceCard
                      key={recipe.uuid}
                      item={recipe}
                      imageHeight={editorsImageHeight}
                      onPress={() => router.push(`/recipe/${recipe.uuid}`)}
                    />
                  ))}
            </View>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}
