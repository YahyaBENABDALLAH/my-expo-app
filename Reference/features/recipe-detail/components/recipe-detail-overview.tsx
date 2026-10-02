import { Host } from "@/components/Universal/host";
import { Icon, icons } from "@/components/Universal/icon";
import { Row } from "@/components/Universal/layout";
import { Text } from "@/components/Universal/text";
import { SafePressable } from "@/components/ui/safe-pressable";
import { space } from "@/constants/theme.tokens";
import { useTheme } from "@/context/theme.context";
import { StatChip } from "@/features/recipe-detail/components/recipe-detail-elements";
import type { RecipeItem } from "@/types/recipe.types";
import { View } from "react-native";

export function RecipeDetailOverview({
  duration,
  onChefPress,
  recipe,
}: {
  duration: string;
  onChefPress: () => void;
  recipe: RecipeItem;
}) {
  const { colors } = useTheme();

  return (
    <>
      <Host
        matchContents={{ vertical: true, horizontal: false }}
        useViewportSizeMeasurement
        style={{ paddingHorizontal: 20, paddingVertical: 20 }}
      >
        <Row alignment="center" spacing={space(5)}>
          <StatChip icon={<Icon name={icons.clock} size={16} color={colors.primary} />} label={duration} />
          {recipe.servings > 0 ? (
            <StatChip icon={<Icon name={icons.users} size={16} color={colors.primary} />} label={`${recipe.servings} servings`} />
          ) : null}
          {recipe.difficultyName ? (
            <StatChip icon={<Icon name={icons.utensils} size={16} color={colors.primary} />} label={recipe.difficultyName} />
          ) : null}
          {recipe.likesCount > 0 ? (
            <StatChip icon={<Icon name={icons.heartFilled} size={16} color={colors.destructive} />} label={String(recipe.likesCount)} />
          ) : null}
        </Row>
      </Host>

      {recipe.chefDisplayName || recipe.cityName ? (
        <View style={{ alignItems: "center", flexDirection: "row", gap: 16, paddingBottom: 16, paddingHorizontal: 20 }}>
          {recipe.chefDisplayName ? (
            <SafePressable onPress={onChefPress} style={{ alignItems: "center", flexDirection: "row", gap: 8, paddingVertical: 4 }}>
              <Icon name={icons.chef} size={16} color={colors.primary} />
              <Text style={[{ color: colors.mutedForeground }, { fontSize: 15 }]}>
                {recipe.chefDisplayName}
              </Text>
            </SafePressable>
          ) : null}
          {recipe.cityName ? (
            <View style={{ alignItems: "center", flexDirection: "row", gap: 8 }}>
              <Icon name={icons.mapPin} size={16} color={colors.primary} />
              <Text style={[{ color: colors.mutedForeground }, { fontSize: 15 }]}>
                {recipe.cityName}
              </Text>
            </View>
          ) : null}
        </View>
      ) : null}

      {recipe.summary ? (
        <View style={{ paddingBottom: 20, paddingHorizontal: 20 }}>
          <Text style={[{ color: colors.mutedForeground }, { fontSize: 16, lineHeight: 28 }]}>
            {recipe.summary}
          </Text>
        </View>
      ) : null}
    </>
  );
}
