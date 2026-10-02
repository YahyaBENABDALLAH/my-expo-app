import { Icon, icons } from "@/components/Universal/icon";
import { Text } from "@/components/Universal/text";
import { QueryErrorState } from "@/components/query-error-state";
import { SafePressable } from "@/components/ui/safe-pressable";
import { useAuthContext } from "@/context/auth.context";
import { useTheme } from "@/context/theme.context";
import { RequireAuth } from "@/guards/require-auth";
import { useFavorites } from "@/hooks/use-favorites";
import { useMyRecipes } from "@/hooks/use-my-recipes";
import { useRecipeLikes } from "@/hooks/use-recipe-likes";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, View, useWindowDimensions } from "react-native";
import { RecipeGrid } from "./components/recipe-grid";
import { toMyRecipeCardItem } from "./my-recipes.utils";

export default function CreationsScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const { user } = useAuthContext();
  const { isError, isFetching, isPending, recipes, refetch } = useMyRecipes(
    user?.chefProfileUuid,
  );
  const likes = useRecipeLikes({ userUuid: user?.uuid });
  const { isFavorite, toggleFavorite } = useFavorites();

  const cards = recipes.map((recipe) =>
    toMyRecipeCardItem(recipe, {
      isFavorite: isFavorite(recipe.uuid),
      isLiked: likes.isRecipeLiked(recipe.uuid),
      isMyRecipe: true,
    }),
  );

  return (
    <RequireAuth>
      <View style={{ flex: 1 }}>
        <View style={{ marginStart: 48, paddingBottom: 12, paddingHorizontal: 16 }}>
          <Text variant="h2" style={{ color: colors.secondary }}>
            {t("common.myOwnTitle") || "My creations"}
          </Text>
        </View>
        {(isError && recipes.length > 0) || likes.isError ? (
          <View style={{ paddingBottom: 12, paddingHorizontal: 16 }}>
            <QueryErrorState
              compact
              isRetrying={isFetching || likes.isFetching}
              message="Some recipe information could not be refreshed."
              onRetry={() =>
                Promise.all([
                  ...(isError ? [refetch()] : []),
                  ...(likes.isError ? [likes.refetch()] : []),
                ])
              }
            />
          </View>
        ) : null}
        {isError && recipes.length === 0 ? (
          <View style={{ flex: 1, justifyContent: "center", paddingHorizontal: 16 }}>
            <QueryErrorState
              isRetrying={isFetching}
              message="We could not load your recipes."
              onRetry={refetch}
            />
          </View>
        ) : isPending ? (
          <View style={{ alignItems: "center", flex: 1, justifyContent: "center" }}>
            <ActivityIndicator color={colors.primary} size="large" />
          </View>
        ) : (
          <RecipeGrid
            cardWidth={(width - 48) / 2}
            emptyAction={
              <SafePressable
                onPress={() => router.push("/create-recipe")}
                style={{
                  alignItems: "center",
                  backgroundColor: colors.primary,
                  borderRadius: 14,
                  flexDirection: "row",
                  gap: 8,
                  marginTop: 8,
                  paddingHorizontal: 20,
                  paddingVertical: 12,
                }}
              >
                <Icon name={icons.plus} size={18} color="#ffffff" />
                <Text style={[{ color: "#ffffff" }, { fontWeight: "600" }]}>
                  {t("common.createRecipe") || "Create a recipe"}
                </Text>
              </SafePressable>
            }
            emptyDescription={
              t("common.noRecipesDescription") || "Your recipes will appear here."
            }
            emptyTitle={t("common.noRecipes") || "No recipes"}
            isFavorite={(recipe) => recipe.isFavorite}
            isLiked={(recipe) => recipe.isLiked}
            onToggleFavorite={(recipe) => void toggleFavorite(recipe.id)}
            onToggleLike={(recipe) => likes.toggleLike(recipe.id)}
            recipes={cards}
          />
        )}
      </View>
    </RequireAuth>
  );
}
