import { Host } from "@/components/Universal/host";
import { Row, Spacer } from "@/components/Universal/layout";
import { Text } from "@/components/Universal/text";
import { Card } from "@/components/ui/surface";
import { space } from "@/constants/theme.tokens";
import { useTheme } from "@/context/theme.context";
import type { RecipeItem } from "@/types/recipe.types";
import { Fragment } from "react";
import { View } from "react-native";
import {
  IngredientRow,
  NutritionChip,
  StepRow,
  TimeMetric,
} from "./recipe-detail-elements";

export function RecipeDetailFacts({
  onIngredientPress,
  recipe,
}: {
  onIngredientPress: (ingredientName: string) => void;
  recipe: RecipeItem;
}) {
  const { colors } = useTheme();
  const nutrition = recipe.nutrition;
  const nutritionItems = [
    typeof nutrition?.caloriesPerServing === "number"
      ? { color: "#f97316", label: "Calories", unit: "kcal", value: String(Math.round(nutrition.caloriesPerServing)) }
      : null,
    typeof nutrition?.proteinGrams === "number"
      ? { color: "#ef4444", label: "Protein", unit: "g", value: String(Math.round(nutrition.proteinGrams)) }
      : null,
    typeof nutrition?.carbsGrams === "number"
      ? { color: "#3b82f6", label: "Carbs", unit: "g", value: String(Math.round(nutrition.carbsGrams)) }
      : null,
    typeof nutrition?.fatGrams === "number"
      ? { color: "#eab308", label: "Fat", unit: "g", value: String(Math.round(nutrition.fatGrams)) }
      : null,
  ].filter((item) => item !== null);
  const ingredients = [...(recipe.ingredients ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);
  const steps = [...(recipe.steps ?? [])].sort((a, b) => a.stepNumber - b.stepNumber);

  return (
    <>
      {recipe.categories?.length ? (
        <View style={{ gap: 10, marginBottom: 20, marginHorizontal: 20 }}>
          <Text style={[{ color: colors.secondaryForeground }, { fontSize: 16, fontWeight: "600" }]}>
            Categories
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {recipe.categories.map((category) => (
              <View key={category} style={{ backgroundColor: colors.muted, borderRadius: 9999, paddingHorizontal: 12, paddingVertical: 6 }}>
                <Text style={[{ color: colors.mutedForeground }, { fontSize: 12, fontWeight: "500" }]}>
                  {category}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {recipe.prepTimeMinutes > 0 || recipe.cookTimeMinutes > 0 ? (
        <Card elevation="item" radius={12} style={{ gap: 12, marginBottom: 20, marginHorizontal: 20, padding: 20 }}>
          <Text style={[{ color: colors.secondaryForeground }, { fontSize: 18, fontWeight: "600" }]}>
            Time Breakdown
          </Text>
          <Host matchContents={{ vertical: true, horizontal: false }} useViewportSizeMeasurement style={{ height: 56 }}>
            <Row alignment="end" spacing={space(6)}>
              {recipe.prepTimeMinutes > 0 ? <TimeMetric value={String(recipe.prepTimeMinutes)} label="min prep" color={colors.primary} /> : null}
              {recipe.cookTimeMinutes > 0 ? <TimeMetric value={String(recipe.cookTimeMinutes)} label="min cook" color={colors.primary} /> : null}
              {recipe.totalTimeMinutes > 0 ? <TimeMetric value={String(recipe.totalTimeMinutes)} label="min total" color={colors.secondaryForeground} /> : null}
            </Row>
          </Host>
        </Card>
      ) : null}

      {nutritionItems.length > 0 ? (
        <Card elevation="item" radius={12} style={{ gap: 12, marginBottom: 20, marginHorizontal: 20, padding: 20 }}>
          <Text style={[{ color: colors.secondaryForeground }, { fontSize: 18, fontWeight: "600" }]}>
            Nutrition per Serving
          </Text>
          <Host matchContents={{ vertical: true, horizontal: false }} useViewportSizeMeasurement style={{ height: 56 }}>
            <Row alignment="end">
              {nutritionItems.map((item, index) => (
                <Fragment key={item.label}>
                  {index > 0 ? <Spacer flexible /> : null}
                  <NutritionChip {...item} />
                </Fragment>
              ))}
            </Row>
          </Host>
        </Card>
      ) : null}

      {ingredients.length > 0 ? (
        <Card elevation="item" radius={12} style={{ gap: 12, marginBottom: 20, marginHorizontal: 20, padding: 20 }}>
          <Text style={[{ color: colors.secondaryForeground }, { fontSize: 18, fontWeight: "600" }]}>
            Ingredients
          </Text>
          <View style={{ gap: 12 }}>
            {ingredients.map((ingredient, index) => (
              <IngredientRow
                key={`${ingredient.ingredientName}-${index}`}
                ingredient={ingredient}
                onPress={() => onIngredientPress(ingredient.ingredientName)}
              />
            ))}
          </View>
        </Card>
      ) : null}

      {steps.length > 0 ? (
        <Card elevation="item" radius={12} style={{ gap: 12, marginBottom: 20, marginHorizontal: 20, padding: 20 }}>
          <Text style={[{ color: colors.secondaryForeground }, { fontSize: 18, fontWeight: "600" }]}>
            Instructions
          </Text>
          <View style={{ gap: 20 }}>
            {steps.map((step) => <StepRow key={step.stepNumber} step={step} />)}
          </View>
        </Card>
      ) : null}
    </>
  );
}
