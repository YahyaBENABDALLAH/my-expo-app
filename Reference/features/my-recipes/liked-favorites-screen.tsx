import { Text } from "@/components/Universal/text";
import { QueryErrorState } from "@/components/query-error-state";
import { useAuthContext } from "@/context/auth.context";
import { useTheme } from "@/context/theme.context";
import { RequireAuth } from "@/guards/require-auth";
import { useFavorites } from "@/hooks/use-favorites";
import { useRecipeLikes } from "@/hooks/use-recipe-likes";
import { getSingleRouteParam } from "@/lib/route-params";
import { getRecipeDetailQueryOptions } from "@/services/recipe/recipe.queries";
import type { RecipeItem } from "@/types/recipe.types";
import { useQueries } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, View, useWindowDimensions } from "react-native";
import { RecipeGrid } from "./components/recipe-grid";
import { toMyRecipeCardItem } from "./my-recipes.utils";

const SUB_TAB = { FAVORITE: "favorite", LIKED: "liked" } as const;
const RECIPE_DETAIL_BATCH_SIZE = 12;
type SubTab = (typeof SUB_TAB)[keyof typeof SUB_TAB];

export default function LikedFavoritesScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const router = useRouter();
  const routeParams = useLocalSearchParams<{ tab?: string | string[] }>();
  const requestedTab = getSingleRouteParam(routeParams.tab);
  const activeTab: SubTab =
    requestedTab === SUB_TAB.FAVORITE ? SUB_TAB.FAVORITE : SUB_TAB.LIKED;
  const { user } = useAuthContext();
  const likes = useRecipeLikes({ userUuid: user?.uuid });
  const favorites = useFavorites();
  const activeUuids =
    activeTab === SUB_TAB.LIKED ? likes.likedRecipeUuids : favorites.favorites;
  const [detailPagination, setDetailPagination] = useState({
    tab: activeTab,
    limit: RECIPE_DETAIL_BATCH_SIZE,
  });
  const detailLimit =
    detailPagination.tab === activeTab
      ? detailPagination.limit
      : RECIPE_DETAIL_BATCH_SIZE;
  const visibleUuids = activeUuids.slice(0, detailLimit);

  const recipeQueries = useQueries({
    queries: visibleUuids.map((uuid) => getRecipeDetailQueryOptions(uuid)),
  });
  const recipes = recipeQueries
    .map(({ data }) => data)
    .filter((recipe): recipe is RecipeItem => Boolean(recipe));
  const cards = recipes.map((recipe) =>
    toMyRecipeCardItem(recipe, {
      isFavorite: favorites.isFavorite(recipe.uuid),
      isLiked: likes.isRecipeLiked(recipe.uuid),
      isMyRecipe: recipe.chefUuid === user?.chefProfileUuid,
    }),
  );
  const hasPendingRecipe = recipeQueries.some(({ isPending }) => isPending);
  const isInitialLoading =
    likes.isPending ||
    favorites.isLoading ||
    (cards.length === 0 && hasPendingRecipe);
  const isLoadingMore = cards.length > 0 && hasPendingRecipe;
  const hasMore = detailLimit < activeUuids.length;
  const hasQueryError =
    (activeTab === SUB_TAB.LIKED && likes.isError) ||
    recipeQueries.some(({ isError }) => isError);
  const isRetrying =
    likes.isFetching || recipeQueries.some(({ isFetching }) => isFetching);
  const retryQueries = () =>
    Promise.all([
      ...(activeTab === SUB_TAB.LIKED ? [likes.refetch()] : []),
      ...recipeQueries
        .filter(({ isError }) => isError)
        .map(({ refetch }) => refetch()),
    ]);
  const loadMore = () => {
    if (!hasMore || isLoadingMore) {
      return;
    }

    setDetailPagination((currentPagination) => ({
      tab: activeTab,
      limit: Math.min(
        (currentPagination.tab === activeTab
          ? currentPagination.limit
          : RECIPE_DETAIL_BATCH_SIZE) + RECIPE_DETAIL_BATCH_SIZE,
        activeUuids.length,
      ),
    }));
  };

  return (
    <RequireAuth>
      <View style={{ flex: 1 }}>
        <View style={{ marginStart: 48, paddingBottom: 12, paddingHorizontal: 16 }}>
          <Text variant="h2" style={{ color: colors.secondary }}>
            {t("common.likedFavorites") || "Favorites & likes"}
          </Text>
        </View>
        <View style={{ paddingHorizontal: 16 }}>
          <View
            style={{
              backgroundColor: colors.muted + "66",
              borderColor: colors.border + "1A",
              borderRadius: 14,
              borderWidth: 1,
              flexDirection: "row",
              padding: 6,
            }}
          >
            {([
              [SUB_TAB.LIKED, t("common.liked") || "Liked", likes.likedRecipeUuids.length],
              [SUB_TAB.FAVORITE, t("common.favorites") || "Favorites", favorites.favorites.length],
            ] as const).map(([tab, label, count]) => (
              <Pressable
                key={tab}
                onPress={() => {
                  router.setParams({ tab });
                }}
                style={{
                  alignItems: "center",
                  backgroundColor: activeTab === tab ? colors.background : "transparent",
                  borderRadius: 10,
                  flex: 1,
                  paddingVertical: 10,
                }}
              >
                <Text
                  style={[{ color: activeTab === tab ? colors.secondary : colors.mutedForeground }, { fontSize: 14, fontWeight: "700" }]}
                >
                  {`${label} (${count})`}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
        {hasQueryError && cards.length === 0 ? (
          <View style={{ flex: 1, justifyContent: "center", paddingHorizontal: 16 }}>
            <QueryErrorState
              isRetrying={isRetrying}
              message="We could not load your selected recipes."
              onRetry={retryQueries}
            />
          </View>
        ) : isInitialLoading ? (
          <View style={{ alignItems: "center", flex: 1, justifyContent: "center" }}>
            <ActivityIndicator color={colors.primary} size="large" />
          </View>
        ) : (
          <RecipeGrid
            cardWidth={(width - 48) / 2}
            emptyDescription={
              t("common.noRecipesDescription") || "Your selected recipes will appear here."
            }
            emptyTitle={t("common.noRecipes") || "No recipes"}
            isFavorite={(recipe) => recipe.isFavorite}
            isLiked={(recipe) => recipe.isLiked}
            isLoadingMore={isLoadingMore}
            onLoadMore={loadMore}
            onToggleFavorite={(recipe) => void favorites.toggleFavorite(recipe.id)}
            onToggleLike={(recipe) => likes.toggleLike(recipe.id)}
            recipes={cards}
          />
        )}
      </View>
    </RequireAuth>
  );
}
