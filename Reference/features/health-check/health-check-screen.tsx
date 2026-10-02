import { useAlert } from "@/components/ui/alert";
import { Button } from "@/components/Universal/button";
import { Card } from "@/components/ui/surface";
import { Text } from "@/components/Universal/text";
import { useTheme } from "@/context/theme.context";
import { RequireAuth } from "@/guards/require-auth";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";

import { useChefProfileListQuery } from "@/services/chef-profile/chef-profile.queries";
import { useCuisineListQuery } from "@/services/cuisine/cuisine.queries";
import {
  useDailyRecipeStatLastQuery,
  useDailyRecipeStatListQuery,
  useDailyRecipeStatTodayQuery,
} from "@/services/daily-recipe-stat/daily-recipe-stat.queries";
import { useDifficultyListQuery } from "@/services/difficulty/difficulty.queries";
import { useFoodCategoryListQuery } from "@/services/food-category/food-category.queries";
import { useIngredientTypeListQuery } from "@/services/ingredient-type/ingredient-type.queries";
import { useIngredientListQuery } from "@/services/ingredient/ingredient.queries";
import { useMoroccanCityListQuery } from "@/services/moroccan-city/moroccan-city.queries";
import { useMoroccanRegionListQuery } from "@/services/moroccan-region/moroccan-region.queries";
import { useRecipeIngredientListQuery } from "@/services/recipe-ingredient/recipe-ingredient.queries";
import { useRecipeNutritionListQuery } from "@/services/recipe-nutrition/recipe-nutrition.queries";
import { useRecipeShareListQuery } from "@/services/recipe-share/recipe-share.queries";
import { useRecipeStepListQuery } from "@/services/recipe-step/recipe-step.queries";
import { useRecipeListQuery } from "@/services/recipe/recipe.queries";
import { useUnitListQuery } from "@/services/unit/unit.queries";

const SERVICE_STATUS = {
  LOADING: "loading",
  ERROR: "error",
  SUCCESS: "success",
} as const;
type ServiceStatus = (typeof SERVICE_STATUS)[keyof typeof SERVICE_STATUS];

function StatusDot({ status }: { status: ServiceStatus }) {
  const color =
    status === SERVICE_STATUS.LOADING
      ? "#eab308"
      : status === SERVICE_STATUS.ERROR
        ? "#ef4444"
        : "#22c55e";

  return (
    <View
      style={{
        height: 12,
        width: 12,
        borderRadius: 9999,
        backgroundColor: color,
      }}
    />
  );
}

function ServiceRow({
  name,
  status,
  count,
  error,
}: {
  name: string;
  status: ServiceStatus;
  count?: number;
  error?: string;
}) {
  const { colors } = useTheme();
  return (
    <Card
      elevation="none"
      outlined
      radius={12}
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
      }}
    >
      <View
        style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 12 }}
      >
        <StatusDot status={status} />
        <Text
          style={[{ color: colors.foreground }, { fontSize: 14, fontWeight: "500" }]}
        >
          {name}
        </Text>
      </View>
      <Text
        style={[{ color: colors.mutedForeground }, { fontSize: 12 }]}
      >
        {status === SERVICE_STATUS.LOADING
          ? "Loading…"
          : status === SERVICE_STATUS.ERROR
            ? (error ?? "Error")
            : `${count ?? 0} items`}
      </Text>
    </Card>
  );
}

export default function HealthCheckScreen() {
  const alert = useAlert();
  const { colors } = useTheme();
  const { t } = useTranslation();

  // ── All list queries ─────────────────────────────────────
  const chefProfiles = useChefProfileListQuery();
  const cuisines = useCuisineListQuery();
  const dailyStats = useDailyRecipeStatListQuery();
  const dailyToday = useDailyRecipeStatTodayQuery();
  const dailyLast = useDailyRecipeStatLastQuery();
  const difficulties = useDifficultyListQuery();
  const foodCategories = useFoodCategoryListQuery();
  const ingredients = useIngredientListQuery();
  const ingredientTypes = useIngredientTypeListQuery();
  const moroccanCities = useMoroccanCityListQuery();
  const moroccanRegions = useMoroccanRegionListQuery();
  const recipes = useRecipeListQuery();
  const recipeIngredients = useRecipeIngredientListQuery();
  const recipeNutrition = useRecipeNutritionListQuery();
  const recipeShares = useRecipeShareListQuery();
  const recipeSteps = useRecipeStepListQuery();
  const units = useUnitListQuery();

  // ── Helpers ──────────────────────────────────────────────
  function getStatus(q: {
    isLoading: boolean;
    isError: boolean;
  }): ServiceStatus {
    if (q.isLoading) return SERVICE_STATUS.LOADING;
    if (q.isError) return SERVICE_STATUS.ERROR;
    return SERVICE_STATUS.SUCCESS;
  }

  function getCount(q: { data: unknown }): number | undefined {
    const d = q.data as
      | { data?: unknown[]; meta?: { totalItems?: number } }
      | unknown[]
      | null;
    if (!d) return undefined;
    if (Array.isArray(d)) return d.length;
    if (typeof d === "object" && "data" in d && Array.isArray(d.data))
      return d.meta?.totalItems ?? d.data.length;
    return 1; // single-object responses (today/last)
  }

  function getError(q: { error: unknown }): string {
    const e = q.error;
    if (e instanceof Error) return e.message;
    return String(e ?? "Unknown error");
  }

  const services = [
    { name: "ChefProfile", q: chefProfiles },
    { name: "Cuisine", q: cuisines },
    { name: "DailyRecipeStat (list)", q: dailyStats },
    { name: "DailyRecipeStat (today)", q: dailyToday },
    { name: "DailyRecipeStat (last)", q: dailyLast },
    { name: "Difficulty", q: difficulties },
    { name: "FoodCategory", q: foodCategories },
    { name: "Ingredient", q: ingredients },
    { name: "IngredientType", q: ingredientTypes },
    { name: "MoroccanCity", q: moroccanCities },
    { name: "MoroccanRegion", q: moroccanRegions },
    { name: "Recipe", q: recipes },
    { name: "RecipeIngredient", q: recipeIngredients },
    { name: "RecipeNutrition", q: recipeNutrition },
    { name: "RecipeShare", q: recipeShares },
    { name: "RecipeStep", q: recipeSteps },
    { name: "Unit", q: units },
  ];

  const successCount = services.filter(
    (s) => getStatus(s.q) === SERVICE_STATUS.SUCCESS,
  ).length;
  const errorCount = services.filter(
    (s) => getStatus(s.q) === SERVICE_STATUS.ERROR,
  ).length;
  const loadingCount = services.filter(
    (s) => getStatus(s.q) === SERVICE_STATUS.LOADING,
  ).length;

  return (
    <RequireAuth>
      <View style={{ flex: 1 }}>
        <View style={{ marginStart: 48, paddingBottom: 12, paddingHorizontal: 16 }}>
          <Text variant="h2" style={{ color: colors.secondary }}>
            {t("common.healthCheck") || "System Health"}
          </Text>
        </View>
        <ScrollView
          style={{ flex: 1, backgroundColor: "transparent" }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 16,
            paddingTop: 16,
            gap: 16,
          }}
        >
          {/* Toast Testing Suite */}
          <Card
            elevation="none"
            outlined
            radius={16}
            style={{
              paddingHorizontal: 20,
              paddingVertical: 20,
              gap: 20,
            }}
          >
            <Text
              style={[{ color: colors.foreground }, { fontSize: 20, fontWeight: "700" }]}
            >
              Alert Interactive Playground
            </Text>

            <View style={{ gap: 12 }}>
              <Text
                style={[{ color: colors.mutedForeground }, {
                  fontSize: 12,
                  fontWeight: "600",
                  letterSpacing: 0.4,
                }]}
              >
                1. GLOBAL ALERT (USEALERT HOOK)
              </Text>
              <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
                <Button
                  fullWidth
                  semantic="success"
                  containerStyle={{ flex: 1, minWidth: 120 }}
                  onPress={() =>
                    alert.success("Email sent", "You will get a reply soon")
                  }
                  label="Success"
                />
                <Button
                  fullWidth
                  semantic="destructive"
                  containerStyle={{ flex: 1, minWidth: 120 }}
                  onPress={() =>
                    alert.danger("Email sent", "You will get a reply soon")
                  }
                  label="Danger"
                />
                <Button
                  fullWidth
                  semantic="warning"
                  containerStyle={{ flex: 1, minWidth: 120 }}
                  onPress={() =>
                    alert.warning("Email sent", "You will get a reply soon")
                  }
                  label="Warning"
                />
                <Button
                  fullWidth
                  semantic="default"
                  containerStyle={{ flex: 1, minWidth: 120 }}
                  onPress={() =>
                    alert.info("Email sent", "You will get a reply soon")
                  }
                  label="Default"
                />
                <Button
                  fullWidth
                  semantic="primary"
                  containerStyle={{ flex: 1, minWidth: 120 }}
                  onPress={() =>
                    alert.primary("Email sent", "You will get a reply soon")
                  }
                  label="Primary"
                />
                <Button
                  fullWidth
                  semantic="secondary"
                  containerStyle={{ flex: 1, minWidth: 120 }}
                  onPress={() =>
                    alert.secondary("Email sent", "You will get a reply soon")
                  }
                  label="Secondary"
                />
              </View>
            </View>

          </Card>

          {/* Summary */}
          <Card
            elevation="none"
            outlined
            radius={12}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 16,
            }}
          >
            <View style={{ marginBottom: 8 }}>
              <Text
                style={[{ color: colors.foreground }, { fontSize: 18, fontWeight: "600" }]}
              >
                {`API Health Check — ${String(services.length)} services`}
              </Text>
            </View>
            <View style={{ flexDirection: "row", gap: 16 }}>
              <Text style={[{ color: "#16a34a" }, { fontSize: 14 }]}>
                {`✅ ${String(successCount)} OK`}
              </Text>
              <Text style={[{ color: "#dc2626" }, { fontSize: 14 }]}>
                {`❌ ${String(errorCount)} Failed`}
              </Text>
              <Text style={[{ color: "#d97706" }, { fontSize: 14 }]}>
                {`⏳ ${String(loadingCount)} Loading`}
              </Text>
            </View>
          </Card>

          {/* Service list */}
          {services.map((s) => (
            <ServiceRow
              key={s.name}
              name={s.name}
              status={getStatus(s.q)}
              count={getCount(s.q)}
              error={getError(s.q)}
            />
          ))}
        </ScrollView>
      </View>
    </RequireAuth>
  );
}
