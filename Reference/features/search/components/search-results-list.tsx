import { SearchResultCard } from "@/components/search-result-card";
import { QueryErrorState } from "@/components/query-error-state";
import { SearchResultCardSkeleton } from "@/components/skeleton/search-result-card-skeleton";
import { Text } from "@/components/Universal/text";
import { useTheme } from "@/context/theme.context";
import type { RecipeItem } from "@/types/recipe.types";
import { ActivityIndicator, FlatList, View } from "react-native";

export function SearchResultsList({
  isLoading,
  isError,
  isRefetching,
  isRetrying,
  onRetry,
  onSelect,
  paddingBottom,
  recipes,
}: {
  isLoading: boolean;
  isError: boolean;
  isRefetching: boolean;
  isRetrying: boolean;
  onRetry: () => unknown;
  onSelect: (uuid: string) => void;
  paddingBottom: number;
  recipes: readonly RecipeItem[];
}) {
  const { colors, tokens } = useTheme();

  return (
    <View style={{ flex: 1 }}>
      {isError && recipes.length > 0 ? (
        <View style={{ paddingBottom: 12, paddingHorizontal: 16 }}>
          <QueryErrorState
            compact
            isRetrying={isRetrying}
            message="Results could not be refreshed. Showing saved content."
            onRetry={onRetry}
          />
        </View>
      ) : null}
      {isRefetching ? (
        <View
          accessibilityLiveRegion="polite"
          accessibilityRole="progressbar"
          accessibilityLabel="Updating search results"
          style={{ alignItems: "center", left: 0, position: "absolute", right: 0, top: 8, zIndex: 10 }}
        >
          <View
            style={[
              { backgroundColor: colors.card, borderRadius: 9999, paddingHorizontal: 16, paddingVertical: 8 },
              tokens.shadows.item,
            ]}
          >
            <ActivityIndicator size="small" color={colors.destructive} />
          </View>
        </View>
      ) : null}
      <FlatList
        accessibilityLabel="Recipe search results"
        data={isLoading ? [] : recipes}
        keyExtractor={(item) => item.uuid}
        contentContainerStyle={{ gap: 12, paddingBottom, paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
        style={{ opacity: isRefetching ? 0.5 : 1 }}
        renderItem={({ item }) => (
          <SearchResultCard recipe={item} onPress={() => onSelect(item.uuid)} />
        )}
        ListEmptyComponent={
          isError ? (
            <QueryErrorState
              isRetrying={isRetrying}
              message="We could not load recipe search results."
              onRetry={onRetry}
            />
          ) : isLoading ? (
            <View style={{ gap: 12 }}>
              {Array.from({ length: 6 }).map((_, index) => (
                <SearchResultCardSkeleton key={index} />
              ))}
            </View>
          ) : (
            <View
              accessibilityLiveRegion="polite"
              accessibilityRole="text"
              style={{ alignItems: "center", gap: 8, paddingVertical: 64 }}
            >
              <Text style={[{ color: colors.mutedForeground }, { fontSize: 17 }]}>
                No recipes found
              </Text>
            </View>
          )
        }
      />
    </View>
  );
}
