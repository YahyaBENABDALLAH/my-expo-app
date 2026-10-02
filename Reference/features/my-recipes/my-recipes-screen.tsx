import { Icon, icons } from "@/components/Universal/icon";
import { QueryErrorState } from "@/components/query-error-state";
import { Card } from "@/components/ui/surface";
import { Text } from "@/components/Universal/text";
import { TAB_BAR_HEIGHT, TAB_BAR_MARGIN } from "@/constants/app.constant";
import { useTheme } from "@/context/theme.context";
import { useAuthContext } from "@/context/auth.context";
import { useMyRecipes } from "@/hooks/use-my-recipes";
import { useRecipeHistory } from "@/hooks/use-recipe-history";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { I18nManager, ScrollView, View } from "react-native";

export function MyRecipesScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { user } = useAuthContext();
  const { isError, isFetching, recipes, refetch } = useMyRecipes(
    user?.chefProfileUuid,
  );
  const { items: historyItems } = useRecipeHistory();

  const myRecipeCount = recipes.length;
  const historyCount = historyItems.length;

  const menuCards = [
    {
      title: t("common.recipeHistory") || "Historique",
      description:
        t("common.recipeHistoryDesc") ||
        "Consultez les dernières recettes que vous avez visitées.",
      countText: `${historyCount} ${t("common.viewed")}`,
      icon: <Icon name={icons.clock} size={22} color={colors.secondary} />,
      iconBg: "rgba(99,102,241,0.1)",
      path: "/my-recipes/history" as const,
    },
    {
      title: t("common.myOwnTitle") || "Mes Créations",
      description:
        t("common.myOwnDesc") ||
        "Gérez et créez vos propres recettes de cuisine.",
      countText: `${myRecipeCount} ${myRecipeCount > 1 ? t("common.recipe_other") : t("common.recipe_one")}`,
      icon: <Icon name={icons.bookOpen} size={22} color={colors.primary} />,
      iconBg: "rgba(20,184,166,0.1)",
      path: "/my-recipes/creations" as const,
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "transparent", paddingTop: 16 }}>
      {/* Header Section */}
      <View style={{ paddingHorizontal: 20, gap: 6, paddingBottom: 24 }}>
        <Text
          style={[{ color: colors.secondary }, { fontSize: 30, fontWeight: "700", letterSpacing: -1.2 }]}
        >
          {t("common.myRecipes") || "Mes recettes"}
        </Text>
        <Text
          style={[{ color: colors.mutedForeground }, { fontSize: 16, lineHeight: 24 }]}
        >
          {t("common.myRecipesDashboardDescription") ||
            "Accédez rapidement à vos sélections, votre historique et vos créations de chef."}
        </Text>
      </View>

      {/* Cards List */}
      <ScrollView
        style={{ flex: 1, backgroundColor: "transparent" }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: TAB_BAR_HEIGHT + TAB_BAR_MARGIN,
          paddingTop: 8,
        }}
      >
        <View style={{ gap: 20 }}>
          {isError && recipes.length === 0 ? (
            <QueryErrorState
              compact
              isRetrying={isFetching}
              message="Recipe counts are temporarily unavailable."
              onRetry={refetch}
            />
          ) : null}
          {menuCards.map((card, idx) => (
            <Card
              key={idx}
              elevation="item"
              outlined
              onPress={() => router.push(card.path)}
              style={{
                padding: 20,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "flex-start",
                  gap: 16,
                }}
              >
                {/* Colored Icon container */}
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    backgroundColor: card.iconBg,
                  }}
                >
                  {card.icon}
                </View>

                {/* Text Description container */}
                <View style={{ flex: 1, gap: 4, paddingRight: 8 }}>
                  <Text
                    style={[{ color: colors.secondary }, {
                      fontSize: 18,
                      fontWeight: "700",
                      letterSpacing: -0.4,
                    }]}
                  >
                    {card.title}
                  </Text>
                  <Text
                    style={[{ color: colors.mutedForeground }, { fontSize: 14, lineHeight: 20 }]}
                  >
                    {card.description}
                  </Text>

                  {/* Item counter badge */}
                  <View
                    style={{
                      alignSelf: "flex-start",
                      marginTop: 4,
                      backgroundColor: colors.muted,
                      paddingHorizontal: 10,
                      paddingVertical: 2,
                      borderRadius: 9999,
                      borderWidth: 1,
                      borderColor: colors.border,
                    }}
                  >
                    <Text
                      style={[{ color: colors.mutedForeground }, { fontSize: 11, fontWeight: "600" }]}
                    >
                      {card.countText}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Right chevron indicator */}
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 9999,
                  backgroundColor: colors.muted,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon
                  name={I18nManager.isRTL ? icons.chevronLeft : icons.chevronRight}
                  size={18}
                  color={colors.mutedForeground}
                />
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
