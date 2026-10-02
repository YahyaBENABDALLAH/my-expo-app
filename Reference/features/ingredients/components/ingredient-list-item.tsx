import { Icon, icons } from "@/components/Universal/icon";
import { Host } from "@/components/Universal/host";
import {
  Column,
  RNHostView,
  Row,
  Spacer,
} from "@/components/Universal/layout";
import { Text } from "@/components/Universal/text";
import { Image } from "@/components/ui/image";
import { Card } from "@/components/ui/surface";
import { useTheme } from "@/context/theme.context";
import type { IngredientItem } from "@/types/ingredient.types";
import { View } from "react-native";
import { getCalorieInfo } from "../ingredients.utils";

export function IngredientListItem({
  ingredient,
  onPress,
}: {
  ingredient: IngredientItem;
  onPress: () => void;
}) {
  const { colors, isDark } = useTheme();
  const calorieInfo = getCalorieInfo(ingredient.caloriesPer100g, isDark);

  return (
    <Card
      elevation="item"
      onPress={onPress}
      style={{ padding: 16 }}
    >
      <Host
        matchContents={{ horizontal: false, vertical: true }}
        useViewportSizeMeasurement
        style={{ width: "100%" }}
      >
        <Row alignment="center" spacing={12} style={{ width: "100%" }}>
          {ingredient.imageUrl ? (
            <RNHostView matchContents style={{ height: 48, width: 48 }}>
              <View
                style={{
                  backgroundColor: colors.muted + "33",
                  borderColor: colors.border + "0D",
                  borderRadius: 14,
                  borderWidth: 1,
                  height: 48,
                  overflow: "hidden",
                  width: 48,
                }}
              >
                <Image
                  source={{ uri: ingredient.imageUrl }}
                  style={{ height: "100%", width: "100%" }}
                  contentFit="cover"
                />
              </View>
            </RNHostView>
          ) : (
            <Column
              alignment="center"
              style={{
                backgroundColor: colors.muted + "33",
                borderColor: colors.border + "0D",
                borderRadius: 14,
                borderWidth: 1,
                height: 48,
                padding: 14,
                width: 48,
              }}
            >
              <Icon
                name={icons.nutrition}
                color={colors.mutedForeground + "99"}
                size={20}
              />
            </Column>
          )}
          <Column spacing={4}>
            <Text
              numberOfLines={1}
              style={[{ color: colors.secondary }, { fontSize: 17, fontWeight: "700" }]}
            >
              {ingredient.name}
            </Text>
            <Text style={[{ color: colors.mutedForeground }, { fontSize: 14, fontWeight: "500" }]}>
              {ingredient.ingredientTypeLabel || "Standard ingredient"}
            </Text>
          </Column>
          <Spacer flexible />
          {ingredient.caloriesPer100g !== null ? (
            <Row
              alignment="center"
              spacing={4}
              style={{
                backgroundColor: calorieInfo?.backgroundColor,
                borderRadius: 9999,
                paddingHorizontal: 10,
                paddingVertical: 4,
              }}
            >
              <Icon name={icons.flame} color={calorieInfo?.color} size={13} />
              <Text
                style={[{ color: calorieInfo?.color }, { fontSize: 12, fontWeight: "600" }]}
              >
                {`${ingredient.caloriesPer100g} kcal`}
              </Text>
            </Row>
          ) : null}
          <Icon name={icons.scale} color={colors.mutedForeground} size={16} />
        </Row>
      </Host>
    </Card>
  );
}
