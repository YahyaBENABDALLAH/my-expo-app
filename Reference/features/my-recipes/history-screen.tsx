import { Icon, icons } from "@/components/Universal/icon";
import { Text } from "@/components/Universal/text";
import { SafePressable } from "@/components/ui/safe-pressable";
import { useTheme } from "@/context/theme.context";
import { RequireAuth } from "@/guards/require-auth";
import { useRecipeHistory } from "@/hooks/use-recipe-history";
import { formatRelativeTime } from "@/lib/date";
import { useTranslation } from "react-i18next";
import { View, useWindowDimensions } from "react-native";
import { RecipeGrid } from "./components/recipe-grid";

export default function HistoryScreen() {
  const { t, i18n } = useTranslation();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const { clearHistory, items } = useRecipeHistory();

  return (
    <RequireAuth>
      <View style={{ flex: 1 }}>
        <View style={{ marginStart: 48, paddingBottom: 12, paddingHorizontal: 16 }}>
          <View style={{ alignItems: "center", flexDirection: "row", justifyContent: "space-between" }}>
            <Text
              style={[{ color: colors.secondary }, { fontSize: 30, fontWeight: "700", letterSpacing: -1.2 }]}
            >
              {t("common.recipeHistory") || "History"}
            </Text>
            {items.length > 0 ? (
              <SafePressable
                onPress={() => void clearHistory()}
                style={{ paddingHorizontal: 12, paddingVertical: 8 }}
              >
                <Text style={[{ color: colors.destructive }, { fontSize: 14, fontWeight: "600" }]}>
                  {t("common.clear") || "Clear"}
                </Text>
              </SafePressable>
            ) : null}
          </View>
        </View>
        <RecipeGrid
          cardWidth={(width - 48) / 2}
          emptyDescription={
            t("common.historyEmptyDescription") || "Recipes you visit will appear here."
          }
          emptyIcon={<Icon name={icons.clock} size={40} color={colors.secondary} />}
          emptyTitle={t("common.historyEmpty") || "History empty"}
          getBadgeText={(recipe) => formatRelativeTime(recipe.viewedAt, i18n.language)}
          recipes={items}
        />
      </View>
    </RequireAuth>
  );
}
