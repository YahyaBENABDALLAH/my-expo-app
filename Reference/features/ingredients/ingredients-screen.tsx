import { Skeleton } from "@/components/skeleton/skeleton";
import { QueryErrorState } from "@/components/query-error-state";
import { Icon, icons } from "@/components/Universal/icon";
import { Card } from "@/components/ui/surface";
import { Text } from "@/components/Universal/text";
import {
    TextInput,
    useNativeState,
} from "@/components/Universal/text-input";
import { useTheme } from "@/context/theme.context";
import { IngredientDetailSheet } from "@/features/ingredients/components/ingredient-detail-sheet";
import { IngredientListItem } from "@/features/ingredients/components/ingredient-list-item";
import { RequireAuth } from "@/guards/require-auth";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { usePullToRefresh } from "@/hooks/use-pull-to-refresh";
import { useIngredientListQuery } from "@/services/ingredient/ingredient.queries";
import type { IngredientItem } from "@/types/ingredient.types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, View } from "react-native";

export default function IngredientsScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState("");
  const searchInputValue = useNativeState("");
  const debouncedSearch = useDebouncedValue(searchText, 300);
  const [page, setPage] = useState(1);
  const [ingredients, setIngredients] = useState<IngredientItem[]>([]);
  const [selectedIngredient, setSelectedIngredient] =
    useState<IngredientItem | null>(null);
  const [isDetailPresented, setIsDetailPresented] = useState(false);

  const handleSearchTextChange = (value: string) => {
    setSearchText(value);
    setPage(1);
  };

  const { data, isError, isPending, isFetching, refetch } = useIngredientListQuery({
    page,
    pageSize: 20,
    search: debouncedSearch.trim() || undefined,
  });

  const { isRefreshing, handleRefresh } = usePullToRefresh(async () => {
    if (page === 1) {
      await refetch();
    } else {
      setPage(1);
    }
  });

  useEffect(() => {
    if (data?.data) {
      requestAnimationFrame(() => {
        if (page === 1) {
          setIngredients(data.data);
        } else {
          setIngredients((prev) => {
            const existingUuids = new Set(prev.map((i) => i.uuid));
            const newItems = data.data.filter(
              (i) => !existingUuids.has(i.uuid),
            );
            return [...prev, ...newItems];
          });
        }
      });
    }
  }, [data, page]);

  const handleLoadMore = () => {
    if (data?.meta.hasNextPage && !isFetching && !isPending) {
      setPage((prev) => prev + 1);
    }
  };

  const handleOpenDetails = (ingredient: IngredientItem) => {
    setSelectedIngredient(ingredient);
    setIsDetailPresented(true);
  };

  const hasInitialError = isError && ingredients.length === 0 && page === 1;
  const hasPaginationError = isError && ingredients.length > 0 && page > 1;

  return (
    <RequireAuth>
      <View style={{ flex: 1 }}>
        <View style={{ marginStart: 48, paddingBottom: 12, paddingHorizontal: 16 }}>
          <Text variant="h2" style={{ color: colors.secondary }}>
            {t("common.ingredients") || "Ingredients"}
          </Text>
        </View>
        {/* Search Bar */}
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 16,
            paddingBottom: 16,
          }}
        >
          <TextInput
            value={searchInputValue}
            onChangeText={handleSearchTextChange}
            placeholder="Search ingredients..."
            autoCapitalize="none"
            returnKeyType="search"
            leftIcon={
              <Icon name={icons.search} size={20} color={colors.mutedForeground} />
            }
            rightIcon={
              searchText.length > 0 ? (
                <Icon name={icons.close} size={18} color={colors.mutedForeground} />
              ) : undefined
            }
            onRightIconPress={
              searchText.length > 0
                ? () => {
                    searchInputValue.set("");
                    handleSearchTextChange("");
                  }
                : undefined
            }
          />
        </View>

        {/* List of Ingredients */}
        <FlatList
          data={ingredients}
          keyExtractor={(item) => item.uuid}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 144,
            gap: 12,
          }}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          renderItem={({ item }) => (
            <IngredientListItem
              ingredient={item}
              onPress={() => handleOpenDetails(item)}
            />
          )}
          ListEmptyComponent={
            hasInitialError ? (
              <QueryErrorState
                isRetrying={isFetching}
                message="We could not load the ingredient list."
                onRetry={refetch}
              />
            ) : isPending && page === 1 ? (
              <View style={{ gap: 12 }}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    style={{ height: 80, width: "100%", borderRadius: 14 }}
                  />
                ))}
              </View>
            ) : (
              <Card
                elevation="none"
                outlined
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: 80,
                  padding: 24,
                }}
              >
                <View style={{ marginBottom: 16 }}>
                  <Icon
                    name={icons.nutrition}
                    size={48}
                    color={colors.mutedForeground + "4D"}
                  />
                </View>
                <Text
                  style={[{
                    color: colors.secondary,
                  }, {
                    fontSize: 18,
                    fontWeight: "700",
                  }]}
                >
                  No ingredients found
                </Text>
                <Text
                  style={[{
                    color: colors.mutedForeground,
                  }, {
                    fontSize: 14,
                    textAlign: "center",
                  }]}
                >
                  Try adjusting your search terms or view another list.
                </Text>
              </Card>
            )
          }
          ListFooterComponent={
            hasPaginationError ? (
              <QueryErrorState
                compact
                isRetrying={isFetching}
                message="We could not load more ingredients."
                onRetry={refetch}
              />
            ) : isFetching && page > 1 ? (
              <View style={{ paddingVertical: 16, alignItems: "center" }}>
                <Skeleton
                  style={{ height: 32, width: 96, borderRadius: 9999 }}
                />
              </View>
            ) : null
          }
        />

        <IngredientDetailSheet
          ingredient={selectedIngredient}
          isPresented={isDetailPresented}
          onDismiss={() => setIsDetailPresented(false)}
        />
      </View>
    </RequireAuth>
  );
}
