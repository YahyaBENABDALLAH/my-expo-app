import { Icon, icons } from "@/components/Universal/icon";
import { Column, Row } from "@/components/Universal/layout";
import { Text } from "@/components/Universal/text";
import { SafePressable } from "@/components/ui/safe-pressable";
import { CONTROL_HEIGHT, space } from "@/constants/theme.tokens";
import { useTheme } from "@/context/theme.context";
import type {
  RecipeDetailIngredient,
  RecipeDetailStep,
} from "@/types/recipe.types";
import type { ReactNode } from "react";
import { View } from "react-native";

export function StatChip({ icon, label }: { icon: ReactNode; label: string }) {
  const { colors } = useTheme();
  return (
    <Row alignment="center" spacing={space(2)}>
      {icon}
      <Text
        style={[{ color: colors.mutedForeground }, { fontSize: 14, fontWeight: "500" }]}
      >
        {label}
      </Text>
    </Row>
  );
}

export function TimeMetric({
  value,
  label,
  color,
}: {
  value: string;
  label: string;
  color: string;
}) {
  const { colors } = useTheme();
  return (
    <Column alignment="center" spacing={space(1)} style={{ height: CONTROL_HEIGHT.lg }}>
      <Text
        numberOfLines={1}
        style={[{ color, height: 32 }, { fontSize: 22, fontWeight: "700", lineHeight: 28 }]}
      >
        {value}
      </Text>
      <Text
        numberOfLines={1}
        style={[{ color: colors.mutedForeground, height: 20 }, { fontSize: 12, fontWeight: "600", lineHeight: 16 }]}
      >
        {label}
      </Text>
    </Column>
  );
}

export function NutritionChip({
  value,
  unit,
  label,
  color,
}: {
  value: string;
  unit: string;
  label: string;
  color: string;
}) {
  const { colors } = useTheme();
  return (
    <Column alignment="center" spacing={space(1)} style={{ height: CONTROL_HEIGHT.lg }}>
      <Row alignment="end" spacing={space(0.5)} style={{ height: CONTROL_HEIGHT.compact }}>
        <Text
          numberOfLines={1}
          style={[{ color, height: 32 }, { fontSize: 22, fontWeight: "700", lineHeight: 28 }]}
        >
          {value}
        </Text>
        <Text
          numberOfLines={1}
          style={[{ color: colors.mutedForeground, height: 24 }, { fontSize: 12, lineHeight: 16 }]}
        >
          {unit}
        </Text>
      </Row>
      <Text
        numberOfLines={1}
        style={[{ color: colors.mutedForeground, height: 20 }, { fontSize: 12, fontWeight: "600", lineHeight: 16, textAlign: "center" }]}
      >
        {label}
      </Text>
    </Column>
  );
}

export function IngredientRow({
  ingredient,
  onPress,
}: {
  ingredient: RecipeDetailIngredient;
  onPress?: () => void;
}) {
  const { colors } = useTheme();
  const quantityText = [
    ingredient.quantity != null ? String(ingredient.quantity) : null,
    ingredient.unitLabel,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <SafePressable
      accessibilityHint={onPress ? "Opens ingredient details" : undefined}
      accessibilityLabel={
        onPress
          ? `${ingredient.ingredientName}${quantityText ? `, ${quantityText}` : ""}${ingredient.isOptional ? ", optional" : ""}`
          : undefined
      }
      onPress={onPress}
      disabled={!onPress}
      style={{ alignItems: "center", flexDirection: "row", gap: 12, paddingVertical: 4 }}
    >
      <View style={{ backgroundColor: colors.primary, borderRadius: 9999, height: 8, width: 8 }} />
      <View style={{ alignItems: "center", flex: 1, flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ alignItems: "center", flex: 1, flexDirection: "row", gap: 6 }}>
          <Text style={[{ color: colors.foreground }, { fontSize: 15, fontWeight: "500" }]}>
            {ingredient.ingredientName}
          </Text>
          {ingredient.isOptional ? (
            <Text style={[{ color: colors.mutedForeground }, { fontSize: 12 }]}>
              (optional)
            </Text>
          ) : null}
        </View>
        {quantityText ? (
          <Text style={[{ color: colors.primary }, { fontSize: 14, fontWeight: "500" }]}>
            {quantityText}
          </Text>
        ) : null}
      </View>
    </SafePressable>
  );
}

export function StepRow({ step }: { step: RecipeDetailStep }) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: "row", gap: 16 }}>
      <View
        style={{
          alignItems: "center",
          backgroundColor: colors.primary,
          borderRadius: 9999,
          height: 32,
          justifyContent: "center",
          width: 32,
        }}
      >
        <Text style={[{ color: "#ffffff" }, { fontSize: 14, fontWeight: "700" }]}>
          {String(step.stepNumber)}
        </Text>
      </View>
      <View style={{ flex: 1, gap: 6, paddingTop: 4 }}>
        {step.title ? (
          <Text style={[{ color: colors.secondary }, { fontSize: 16, fontWeight: "600" }]}>
            {step.title}
          </Text>
        ) : null}
        <Text style={[{ color: colors.mutedForeground }, { fontSize: 15, lineHeight: 24 }]}>
          {step.instruction}
        </Text>
        {step.durationMinutes != null && step.durationMinutes > 0 ? (
          <View style={{ alignItems: "center", flexDirection: "row", gap: 6, paddingTop: 4 }}>
            <Icon name={icons.clock} size={12} color={colors.mutedForeground} />
            <Text style={[{ color: colors.mutedForeground }, { fontSize: 12 }]}>
              {`${String(step.durationMinutes)} min`}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}
