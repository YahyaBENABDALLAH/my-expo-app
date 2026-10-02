import { BottomSheet } from "@/components/Universal/bottom-sheet";
import { IconButton } from "@/components/Universal/button";
import { Icon, icons, type AppIconName } from "@/components/Universal/icon";
import { RNHostView } from "@/components/Universal/rn-host-view";
import { Text } from "@/components/Universal/text";
import { Badge } from "@/components/ui/badge";
import { Image } from "@/components/ui/image";
import { Card } from "@/components/ui/surface";
import { useTheme } from "@/context/theme.context";
import type { IngredientItem } from "@/types/ingredient.types";
import type { ReactNode } from "react";
import { ScrollView, View } from "react-native";

import { getCalorieInfo } from "../ingredients.utils";

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: AppIconName;
  label: string;
  value: ReactNode;
}) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <View style={{ alignItems: "center", flexDirection: "row", gap: 10 }}>
        <View
          style={{
            backgroundColor: colors.muted + "80",
            borderRadius: 14,
            padding: 8,
          }}
        >
          <Icon name={icon} color={colors.mutedForeground} size={15} />
        </View>
        <Text
          style={[{ color: colors.mutedForeground }, { fontSize: 14, fontWeight: "600" }]}
        >
          {label}
        </Text>
      </View>
      {value}
    </View>
  );
}

export function IngredientDetailSheet({
  ingredient,
  isPresented,
  onDismiss,
}: {
  ingredient: IngredientItem | null;
  isPresented: boolean;
  onDismiss: () => void;
}) {
  const { colors, isDark } = useTheme();

  if (!ingredient) return null;

  const calorieInfo = getCalorieInfo(ingredient.caloriesPer100g, isDark);
  const percentage =
    ingredient.caloriesPer100g === null
      ? 0
      : Math.min(
          100,
          Math.max(5, (ingredient.caloriesPer100g / 600) * 100),
        );
  const valueTextStyle = { fontSize: 14, fontWeight: "700" as const };

  return (
    <BottomSheet
      contentPadding={0}
      isPresented={isPresented}
      onDismiss={onDismiss}
      showDragIndicator
      snapPoints={[{ fraction: 0.72 }, "full"]}
      testID="ingredient-detail-sheet"
    >
      <RNHostView>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 32, paddingHorizontal: 20 }}
          showsVerticalScrollIndicator={false}
          style={{ maxHeight: 640 }}
        >
          <View style={{ alignItems: "flex-end", height: 44 }}>
            <IconButton
              accessibilityLabel="Close ingredient details"
              icon={icons.close}
              onPress={onDismiss}
              size="md"
            />
          </View>

          <View style={{ alignItems: "center", gap: 8 }}>
            {ingredient.imageUrl ? (
              <View
                style={{
                  borderRadius: 14,
                  height: 96,
                  marginBottom: 8,
                  overflow: "hidden",
                  width: 96,
                }}
              >
                <Image
                  contentFit="cover"
                  source={{ uri: ingredient.imageUrl }}
                  style={{ height: "100%", width: "100%" }}
                />
              </View>
            ) : (
              <View
                style={{
                  alignItems: "center",
                  backgroundColor: "rgba(16,185,129,0.1)",
                  borderRadius: 9999,
                  height: 64,
                  justifyContent: "center",
                  marginBottom: 8,
                  width: 64,
                }}
              >
                <Icon name={icons.nutrition} color="#059669" size={32} />
              </View>
            )}
            <Text
              style={[{ color: colors.secondary }, {
                fontSize: 24,
                fontWeight: "800",
                textAlign: "center",
              }]}
            >
              {ingredient.name}
            </Text>
            <Text
              style={[{ color: colors.mutedForeground }, { fontSize: 14, textAlign: "center" }]}
            >
              {ingredient.ingredientTypeLabel || "Standard ingredient"}
            </Text>
          </View>

          <View style={{ gap: 16, marginTop: 24 }}>
            {ingredient.caloriesPer100g !== null ? (
              <View
                style={{
                  backgroundColor: colors.muted + "33",
                  borderRadius: 14,
                  gap: 8,
                  padding: 16,
                }}
              >
                <View
                  style={{
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={[{ color: colors.secondary }, { fontSize: 15, fontWeight: "700" }]}
                  >
                    Energy density
                  </Text>
                  <Text
                    style={[{ color: calorieInfo?.color }, { fontSize: 15, fontWeight: "800" }]}
                  >
                    {`${ingredient.caloriesPer100g} kcal`}
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: colors.muted,
                    borderRadius: 9999,
                    height: 8,
                    overflow: "hidden",
                  }}
                >
                  <View
                    style={{
                      backgroundColor: calorieInfo?.barColor,
                      height: "100%",
                      width: `${percentage}%`,
                    }}
                  />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={[{ color: colors.mutedForeground }, { fontSize: 11 }]}
                  >
                    {calorieInfo?.label}
                  </Text>
                  <Text
                    style={[{ color: colors.mutedForeground }, { fontSize: 11 }]}
                  >
                    per 100g
                  </Text>
                </View>
              </View>
            ) : null}

            <Card elevation="none" outlined style={{ gap: 14, padding: 16 }}>
              <DetailRow
                icon={icons.nutrition}
                label="Type"
                value={
                  <Text
                    style={[{ color: colors.secondary }, valueTextStyle]}
                  >
                    {ingredient.ingredientTypeLabel || "Unknown"}
                  </Text>
                }
              />
              <DetailRow
                icon={icons.scale}
                label="Default unit"
                value={
                  <Badge variant="secondary">
                    <Text style={{ fontSize: 12, fontWeight: "700" }}>
                      {ingredient.defaultUnitLabel || "g"}
                    </Text>
                  </Badge>
                }
              />
              <DetailRow
                icon={icons.hash}
                label="Reference code"
                value={
                  <Text
                    style={[{ color: colors.secondary }, valueTextStyle]}
                  >
                    {ingredient.code || "N/A"}
                  </Text>
                }
              />
              <DetailRow
                icon={icons.checkCircle}
                label="Status"
                value={
                  <Badge
                    variant={ingredient.isActive ? "default" : "destructive"}
                  >
                    <Text style={{ fontSize: 12, fontWeight: "700" }}>
                      {ingredient.isActive ? "Active" : "Inactive"}
                    </Text>
                  </Badge>
                }
              />
            </Card>
          </View>
        </ScrollView>
      </RNHostView>
    </BottomSheet>
  );
}
