import { Icon, icons } from "@/components/Universal/icon";
import { Host } from "@/components/Universal/host";
import { Column, Row } from "@/components/Universal/layout";
import { Text } from "@/components/Universal/text";
import { Image } from "@/components/ui/image";
import { SafePressable } from "@/components/ui/safe-pressable";
import { Card } from "@/components/ui/surface";
import { useTheme } from "@/context/theme.context";
import type { RecipeCardItem } from "@/types/my-recipes.types";
import { router } from "expo-router";
import type { ReactNode } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

interface RecipeGridProps<TRecipe extends RecipeCardItem> {
  cardWidth: number;
  emptyAction?: ReactNode;
  emptyDescription: string;
  emptyIcon?: ReactNode;
  emptyTitle: string;
  getBadgeText?: (recipe: TRecipe) => string | undefined;
  isLoadingMore?: boolean;
  isFavorite?: (recipe: TRecipe) => boolean;
  isLiked?: (recipe: TRecipe) => boolean;
  onLoadMore?: () => void;
  onToggleFavorite?: (recipe: TRecipe) => void;
  onToggleLike?: (recipe: TRecipe) => void;
  recipes: readonly TRecipe[];
}

export function RecipeGrid<TRecipe extends RecipeCardItem>({
  cardWidth,
  emptyAction,
  emptyDescription,
  emptyIcon,
  emptyTitle,
  getBadgeText,
  isLoadingMore = false,
  isFavorite,
  isLiked,
  onLoadMore,
  onToggleFavorite,
  onToggleLike,
  recipes,
}: RecipeGridProps<TRecipe>) {
  const { colors } = useTheme();

  if (recipes.length === 0) {
    return (
      <View
        style={{
          alignItems: "center",
          flex: 1,
          gap: 16,
          justifyContent: "center",
          paddingHorizontal: 16,
          paddingVertical: 80,
        }}
      >
        <View
          style={{
            alignItems: "center",
            backgroundColor: colors.primary + "1A",
            borderRadius: 9999,
            height: 80,
            justifyContent: "center",
            width: 80,
          }}
        >
          {emptyIcon ?? (
            <Icon name={icons.bookOpen} size={40} color={colors.primary} />
          )}
        </View>
        <View style={{ alignItems: "center", gap: 6 }}>
          <Text
            style={[{ color: colors.secondary }, { fontSize: 20, fontWeight: "700", textAlign: "center" }]}
          >
            {emptyTitle}
          </Text>
          <Text
            style={[{ color: colors.mutedForeground }, { fontSize: 14, textAlign: "center" }]}
          >
            {emptyDescription}
          </Text>
        </View>
        {emptyAction}
      </View>
    );
  }

  return (
    <FlatList
      data={recipes}
      keyExtractor={(recipe) => recipe.id}
      numColumns={2}
      initialNumToRender={6}
      maxToRenderPerBatch={6}
      updateCellsBatchingPeriod={50}
      windowSize={5}
      removeClippedSubviews={process.env.EXPO_OS === "android"}
      showsVerticalScrollIndicator={false}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.5}
      style={{ flex: 1 }}
      contentContainerStyle={{
        paddingBottom: 80,
        paddingHorizontal: 16,
        paddingTop: 16,
      }}
      columnWrapperStyle={{ justifyContent: "space-between" }}
      ListFooterComponent={
        isLoadingMore ? (
          <View style={{ alignItems: "center", paddingVertical: 16 }}>
            <ActivityIndicator color={colors.primary} size="small" />
          </View>
        ) : null
      }
      renderItem={({ item: recipe }) => {
        const badgeText = getBadgeText?.(recipe);
        const favorite = isFavorite?.(recipe) ?? false;
        const liked = isLiked?.(recipe) ?? false;

        return (
          <View
            style={{ gap: 12, marginBottom: 24, width: cardWidth }}
          >
            <Card
              elevation="none"
              outlined
              style={{ height: 150, overflow: "hidden", position: "relative" }}
            >
              <SafePressable
                accessibilityHint="Opens recipe details"
                accessibilityLabel={recipe.title}
                onPress={() => router.push(`/recipe/${recipe.id}`)}
                style={StyleSheet.absoluteFill}
              >
                <Image
                  source={{ uri: recipe.imageUri }}
                  contentFit="cover"
                  transition={200}
                  style={StyleSheet.absoluteFill}
                />
                <View
                  style={[
                    StyleSheet.absoluteFill,
                    { backgroundColor: "rgba(0,0,0,0.05)" },
                  ]}
                />
              </SafePressable>

              {recipe.rating ? (
                <View
                  style={{
                    alignItems: "center",
                    backgroundColor: "rgba(255,255,255,0.9)",
                    borderRadius: 9999,
                    flexDirection: "row",
                    gap: 4,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    position: "absolute",
                    start: 10,
                    top: 10,
                  }}
                >
                  <Host matchContents>
                    <Row alignment="center" spacing={4}>
                      <Icon
                        name={icons.starFilled}
                        size={11}
                        color={colors.warning}
                      />
                      <Text
                        style={[{ color: colors.secondary }, { fontSize: 11, fontWeight: "700" }]}
                      >
                        {recipe.rating}
                      </Text>
                    </Row>
                  </Host>
                </View>
              ) : null}

              {badgeText ? (
                <View
                  style={{
                    backgroundColor: "rgba(0,0,0,0.6)",
                    borderRadius: 9999,
                    bottom: 10,
                    paddingHorizontal: 10,
                    paddingVertical: 2,
                    position: "absolute",
                    start: 10,
                  }}
                >
                  <Text
                    style={[{ color: "#ffffff" }, { fontSize: 9, fontWeight: "600" }]}
                  >
                    {badgeText}
                  </Text>
                </View>
              ) : null}

              {onToggleFavorite ? (
                <Pressable
                  accessibilityLabel={
                    favorite
                      ? `Remove ${recipe.title} from favorites`
                      : `Add ${recipe.title} to favorites`
                  }
                  accessibilityRole="button"
                  accessibilityState={{ selected: favorite }}
                  onPress={() => onToggleFavorite(recipe)}
                  style={{
                    alignItems: "center",
                    backgroundColor: colors.card,
                    borderRadius: 9999,
                    bottom: 10,
                    height: 36,
                    justifyContent: "center",
                    position: "absolute",
                    right: 10,
                    width: 36,
                  }}
                >
                  <Icon
                    name={favorite ? icons.heartFilled : icons.heart}
                    size={15}
                    color={favorite ? colors.primary : colors.mutedForeground}
                  />
                </Pressable>
              ) : null}

              {onToggleLike ? (
                <Pressable
                  accessibilityLabel={
                    liked ? `Unlike ${recipe.title}` : `Like ${recipe.title}`
                  }
                  accessibilityRole="button"
                  accessibilityState={{ selected: liked }}
                  onPress={() => onToggleLike(recipe)}
                  style={{
                    alignItems: "center",
                    backgroundColor: colors.card + "E6",
                    borderRadius: 9999,
                    height: 36,
                    justifyContent: "center",
                    position: "absolute",
                    right: 10,
                    top: 10,
                    width: 36,
                  }}
                >
                  <Icon
                    name={liked ? icons.heartFilled : icons.heart}
                    size={15}
                    color={liked ? colors.destructive : colors.mutedForeground}
                  />
                </Pressable>
              ) : null}
            </Card>

            <Host
              matchContents={{ horizontal: false, vertical: true }}
              useViewportSizeMeasurement
              style={{ paddingHorizontal: 4, width: "100%" }}
            >
              <Column spacing={4}>
                <Text
                  numberOfLines={1}
                  style={[{ color: colors.secondary }, {
                    fontSize: 16,
                    fontWeight: "700",
                    letterSpacing: -0.4,
                    lineHeight: 20,
                  }]}
                >
                  {recipe.title}
                </Text>
                <Row alignment="center" spacing={8}>
                  <Row alignment="center" spacing={4}>
                  <Icon name={icons.clock} color={colors.primary} size={14} />
                  <Text
                    style={[{ color: colors.primary }, { fontSize: 12, fontWeight: "500" }]}
                  >
                    {recipe.duration}
                  </Text>
                  </Row>
                  <Text
                    style={[{ color: colors.mutedForeground }, { fontSize: 10 }]}
                  >
                    ·
                  </Text>
                  <Row alignment="center" spacing={4}>
                    <Icon
                      name={icons.flame}
                      color={colors.mutedForeground}
                      size={14}
                    />
                    <Text
                      style={[{ color: colors.mutedForeground }, { fontSize: 12 }]}
                    >
                      {recipe.calories}
                    </Text>
                  </Row>
                </Row>
              </Column>
            </Host>
          </View>
        );
      }}
    />
  );
}
