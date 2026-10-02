import { Text } from "@/components/Universal/text";
import { QueryErrorState } from "@/components/query-error-state";
import { Skeleton } from "@/components/skeleton/skeleton";
import { Image } from "@/components/ui/image";
import { Card } from "@/components/ui/surface";
import { useTheme } from "@/context/theme.context";
import type { FoodCategoryItem } from "@/types/food-category.types";
import { FlatList, View } from "react-native";

export function SearchCategoryBrowser({
  categories,
  isError,
  isLoading,
  isRetrying,
  onRetry,
  onSelect,
  paddingBottom,
}: {
  categories: readonly FoodCategoryItem[];
  isError: boolean;
  isLoading: boolean;
  isRetrying: boolean;
  onRetry: () => unknown;
  onSelect: (uuid: string) => void;
  paddingBottom: number;
}) {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1 }}>
      <Text style={[{ color: colors.secondary }, { fontSize: 20, fontWeight: "600" }]}>
        Browse Categories
      </Text>
      {isError && categories.length === 0 ? (
        <View style={{ paddingHorizontal: 16 }}>
          <QueryErrorState
            isRetrying={isRetrying}
            message="We could not load recipe categories."
            onRetry={onRetry}
          />
        </View>
      ) : isLoading ? (
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, paddingHorizontal: 20 }}>
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} style={{ borderRadius: 14, height: 48, width: "47%" }} />
          ))}
        </View>
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.uuid}
          numColumns={2}
          contentContainerStyle={{ gap: 12, paddingBottom, paddingHorizontal: 16 }}
          columnWrapperStyle={{ gap: 12 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Card
              elevation="item"
              onPress={() => onSelect(item.uuid)}
              style={{ alignItems: "center", flex: 1, flexDirection: "row", gap: 12, minWidth: "45%", padding: 16 }}
            >
              <Image
                source={{ uri: item.iconUrl ?? undefined }}
                contentFit="cover"
                transition={150}
                style={{ borderRadius: 9999, height: 40, width: 40 }}
              />
              <Text
                numberOfLines={2}
                style={[{ color: colors.secondary }, { fontSize: 16, fontWeight: "600" }]}
              >
                {item.name}
              </Text>
            </Card>
          )}
          ListHeaderComponent={
            isError ? (
              <View style={{ marginBottom: 12 }}>
                <QueryErrorState
                  compact
                  isRetrying={isRetrying}
                  message="Categories could not be refreshed. Showing saved content."
                  onRetry={onRetry}
                />
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View style={{ alignItems: "center", paddingVertical: 64 }}>
              <Text style={{ color: colors.mutedForeground }}>No categories available</Text>
            </View>
          }
        />
      )}
    </View>
  );
}
