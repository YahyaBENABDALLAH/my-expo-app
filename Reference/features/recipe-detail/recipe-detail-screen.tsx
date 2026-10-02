import { Text } from "@/components/Universal/text";
import { QueryErrorState } from "@/components/query-error-state";
import { RecipeDetailSkeleton } from "@/components/skeleton/recipe-detail-skeleton";
import { BackHeader } from "@/components/ui/back-header";
import { useAuthContext } from "@/context/auth.context";
import { useTheme } from "@/context/theme.context";
import { RecipeDetailActions } from "@/features/recipe-detail/components/recipe-detail-actions";
import { RecipeDetailFacts } from "@/features/recipe-detail/components/recipe-detail-facts";
import { RecipeDetailHero } from "@/features/recipe-detail/components/recipe-detail-hero";
import { RecipeDetailOverview } from "@/features/recipe-detail/components/recipe-detail-overview";
import { RequireAuth } from "@/guards/require-auth";
import { useRecipeHistory } from "@/hooks/use-recipe-history";
import { useRecipeLikes } from "@/hooks/use-recipe-likes";
import { formatRecipeDuration, resolveRecipeImageUri } from "@/lib/recipe";
import { useRecipeIngredientListQuery } from "@/services/recipe-ingredient/recipe-ingredient.queries";
import { useRecipeDetailQuery } from "@/services/recipe/recipe.queries";
import { useNavigation, useRouter } from "expo-router";
import { useDrawerStatus } from "expo-router/drawer";
import { DrawerActions } from "expo-router/react-navigation";
import { useEffect } from "react";
import { Pressable, Share, View } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

interface RecipeDetailScreenProps {
  uuid: string;
}

export default function RecipeDetailScreen({ uuid }: RecipeDetailScreenProps) {
  const router = useRouter();
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { user } = useAuthContext();
  const recipeQuery = useRecipeDetailQuery(uuid);
  const { data: recipe, isPending } = recipeQuery;
  const recipeIngredientsQuery = useRecipeIngredientListQuery({
    recipeUuid: uuid,
  });
  const recipeIngredientsData = recipeIngredientsQuery.data;
  const likes = useRecipeLikes({
    recipeUuid: uuid,
    userUuid: user?.uuid,
  });
  const { recordView } = useRecipeHistory();
  const isDrawerOpen = useDrawerStatus() === "open";
  const scrollOffset = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((event) => {
    scrollOffset.value = event.contentOffset.y;
  });

  useEffect(() => {
    if (recipe) void recordView(recipe);
  }, [recipe, recordView]);

  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace("/");
  };

  if (isPending) {
    return (
      <RequireAuth>
        <RecipeDetailSkeleton onBack={handleBack} />
      </RequireAuth>
    );
  }

  if (recipeQuery.isError && !recipe) {
    return (
      <RequireAuth>
        <View style={{ backgroundColor: "transparent", flex: 1 }}>
          <BackHeader onPress={handleBack} />
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              paddingHorizontal: 16,
              paddingTop: 16,
            }}
          >
            <QueryErrorState
              isRetrying={recipeQuery.isFetching}
              message="We could not load this recipe."
              onRetry={recipeQuery.refetch}
            />
          </View>
        </View>
      </RequireAuth>
    );
  }

  if (!recipe) {
    return (
      <RequireAuth>
        <View style={{ alignItems: "center", flex: 1, justifyContent: "center" }}>
          <Text style={{ color: colors.mutedForeground }}>Recipe not found</Text>
          <Pressable onPress={handleBack} style={{ marginTop: 16 }}>
            <Text style={[{ color: colors.primary }, { fontWeight: "600" }]}>
              Go Back
            </Text>
          </Pressable>
        </View>
      </RequireAuth>
    );
  }

  const openDrawer = (showDrawer: "chef" | "ingredient", itemId?: string | null) => {
    if (!itemId) return;
    router.setParams({ itemId, showDrawer });
    navigation.dispatch(DrawerActions.openDrawer());
  };
  const handleIngredientPress = (ingredientName: string) => {
    const ingredient = (recipeIngredientsData?.data ?? []).find(
      (item) => item.ingredientName?.toLowerCase() === ingredientName.toLowerCase(),
    );
    openDrawer("ingredient", ingredient?.ingredientUuid);
  };
  const hasSecondaryQueryError =
    recipeIngredientsQuery.isError || likes.isError;
  const retrySecondaryQueries = () =>
    Promise.all([
      ...(recipeIngredientsQuery.isError
        ? [recipeIngredientsQuery.refetch()]
        : []),
      ...(likes.isError ? [likes.refetch()] : []),
    ]);
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this recipe: ${recipe.title}\n\n${recipe.summary || ""}`,
        title: recipe.title,
      });
    } catch (error) {
      console.error("Sharing error:", error);
    }
  };

  return (
    <RequireAuth>
      <View style={{ backgroundColor: "transparent", flex: 1 }}>
        {!isDrawerOpen ? <BackHeader onPress={handleBack} /> : null}
        {!isDrawerOpen ? (
          <RecipeDetailActions
            isLiked={likes.isRecipeLiked(uuid)}
            onLike={() => likes.toggleLike(uuid)}
            onShare={() => void handleShare()}
            scrollOffset={scrollOffset}
          />
        ) : null}
        <Animated.ScrollView
          onScroll={onScroll}
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 128 }}
          scrollEventThrottle={16}
        >
          <RecipeDetailHero
            imageUri={resolveRecipeImageUri(recipe)}
            recipe={recipe}
            scrollOffset={scrollOffset}
          />
          <RecipeDetailOverview
            duration={formatRecipeDuration(recipe)}
            onChefPress={() => openDrawer("chef", recipe.chefUuid)}
            recipe={recipe}
          />
          {hasSecondaryQueryError ? (
            <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
              <QueryErrorState
                compact
                isRetrying={
                  recipeIngredientsQuery.isFetching || likes.isFetching
                }
                message="Some recipe details could not be refreshed."
                onRetry={retrySecondaryQueries}
              />
            </View>
          ) : null}
          <RecipeDetailFacts
            onIngredientPress={handleIngredientPress}
            recipe={recipe}
          />
        </Animated.ScrollView>
      </View>
    </RequireAuth>
  );
}
