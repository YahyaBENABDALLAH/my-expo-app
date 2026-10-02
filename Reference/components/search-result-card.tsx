import { Icon, icons } from "@/components/Universal/icon";
import { Host } from "@/components/Universal/host";
import {
  Column,
  RNHostView,
  Row,
  Spacer,
} from "@/components/Universal/layout";
import { Image } from "@/components/ui/image";
import { SafePressable } from "@/components/ui/safe-pressable";
import { Card } from "@/components/ui/surface";
import { Text } from "@/components/Universal/text";
import { useTheme } from "@/context/theme.context";
import { getInitialsAvatarUrl } from "@/lib/avatar";
import {
  formatRecipeDuration,
  resolveRecipeImageUri,
} from "@/lib/recipe";
import type { RecipeItem } from "@/types/recipe.types";
import { I18nManager, View } from "react-native";

interface SearchResultCardProps {
  recipe: RecipeItem;
  onPress: () => void;
}

export function SearchResultCard({ recipe, onPress }: SearchResultCardProps) {
  const { colors } = useTheme();
  const duration = formatRecipeDuration(recipe);
  const isRTL = I18nManager.isRTL;
  const chefAvatarUrl = getInitialsAvatarUrl(recipe.chefDisplayName);

  return (
    <SafePressable
      accessibilityHint="Opens recipe details"
      accessibilityLabel={`${recipe.title}. ${duration}${recipe.difficultyName ? `. ${recipe.difficultyName}` : ""}`}
      onPress={onPress}
    >
      <Card
        elevation="item"
        style={{ flexDirection: "row", overflow: "hidden" }}
      >
        <Image
          source={{ uri: resolveRecipeImageUri(recipe) }}
          contentFit="cover"
          transition={200}
          style={[
            { width: 96, height: 96 },
            isRTL
              ? { borderTopRightRadius: 14, borderBottomRightRadius: 14 }
              : { borderTopLeftRadius: 14, borderBottomLeftRadius: 14 },
          ]}
        />
        <View style={{ flex: 1, padding: 8, paddingVertical: 4 }}>
          <Host
            aria-hidden
            matchContents={{ horizontal: false, vertical: true }}
            pointerEvents="none"
            useViewportSizeMeasurement
            style={{ width: "100%" }}
          >
            <Column spacing={4}>
            {recipe.cuisineName ? (
              <Text
                style={[{ color: colors.primary }, {
                  fontSize: 12,
                  fontWeight: "700",
                  letterSpacing: 0.5,
                }]}
              >
                {recipe.cuisineName}
              </Text>
            ) : null}
            <Text
              numberOfLines={2}
              style={[{ color: colors.foreground }, { fontSize: 16, fontWeight: "600", lineHeight: 21 }]}
            >
              {recipe.title}
            </Text>

            {recipe.chefDisplayName ? (
              <Row
                alignment="center"
                spacing={8}
                style={{
                  borderRadius: 9999,
                  backgroundColor: colors.muted,
                  padding: 4,
                  paddingRight: 12,
                }}
              >
                {chefAvatarUrl ? (
                  <RNHostView matchContents style={{ width: 20, height: 20 }}>
                    <Image
                      source={{ uri: chefAvatarUrl }}
                      style={{ width: 20, height: 20, borderRadius: 9999 }}
                      contentFit="cover"
                    />
                  </RNHostView>
                ) : null}
                <Text
                  style={[{ color: colors.mutedForeground }, { fontSize: 12, fontWeight: "500" }]}
                  numberOfLines={1}
                >
                  {recipe.chefDisplayName}
                </Text>
              </Row>
            ) : null}

            <Row alignment="center" spacing={12} style={{ paddingTop: 4 }}>
              <Row alignment="center" spacing={6}>
                <Icon
                  name={icons.clock}
                  size={13}
                  color={colors.mutedForeground}
                />
                <Text
                  style={[{ color: colors.mutedForeground }, { fontSize: 12 }]}
                >
                  {duration}
                </Text>
              </Row>
              {recipe.difficultyName ? (
                <Row alignment="center" spacing={6}>
                  <Text
                    style={[{ color: colors.mutedForeground }, { fontSize: 12 }]}
                  >
                    •
                  </Text>
                  <Text
                    style={[{ color: colors.mutedForeground }, { fontSize: 12 }]}
                  >
                    {recipe.difficultyName}
                  </Text>
                </Row>
              ) : null}
              <Spacer flexible />

              {recipe.likesCount > 0 ? (
                <Row alignment="center" spacing={4}>
                  <Icon
                    name={icons.heartFilled}
                    size={12}
                    color={colors.destructive}
                  />
                  <Text
                    style={[{ color: colors.foreground }, { fontSize: 12, fontWeight: "500" }]}
                  >
                    {String(recipe.likesCount)}
                  </Text>
                </Row>
              ) : null}
            </Row>
          </Column>
          </Host>
        </View>
      </Card>
    </SafePressable>
  );
}
