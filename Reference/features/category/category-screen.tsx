import { PopularRecipeCard } from "@/components/popular-recipe-card";
import { QueryErrorState } from "@/components/query-error-state";
import { Skeleton } from "@/components/skeleton/skeleton";
import { Icon, icons } from "@/components/Universal/icon";
import { Text } from "@/components/Universal/text";
import {
  TextInput,
  useNativeState,
} from "@/components/Universal/text-input";
import { useTheme } from "@/context/theme.context";
import { toPopularRecipe } from "@/features/home/home.utils";
import { RequireAuth } from "@/guards/require-auth";
import { useFoodCategoryDetailQuery } from "@/services/food-category/food-category.queries";
import { useRecipeListQuery } from "@/services/recipe/recipe.queries";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, View } from "react-native";

const PAGE_SIZE = 20;

export default function CategoryScreen({ uuid }: { uuid: string }) {
  const router = useRouter();
  const { colors } = useTheme();
  const [search, setSearch] = useState("");
  const searchInputValue = useNativeState("");

  const categoryQuery = useFoodCategoryDetailQuery(uuid);
  const categoryName = categoryQuery.data?.name ?? "Category";

  const recipesQuery = useRecipeListQuery({
    page: 1,
    pageSize: PAGE_SIZE,
    categoryUuid: uuid,
    search: search.trim() || undefined,
  });

  const recipes = recipesQuery.data?.data ?? [];
  const isLoading = recipesQuery.isPending;
  const hasInitialError = recipesQuery.isError && recipes.length === 0;

  return (
    <RequireAuth>
      <View style={{ flex: 1 }}>
        <View style={{ marginStart: 48, paddingBottom: 12, paddingHorizontal: 16 }}>
          {categoryQuery.isPending ? (
            <Skeleton style={{ height: 40, width: 192, borderRadius: 9999 }} />
          ) : (
            <Text variant="h2" style={{ color: colors.secondary }}>
              {categoryName}
            </Text>
          )}
        </View>
        {/* Search within category */}
        <View style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
          <TextInput
            value={searchInputValue}
            onChangeText={setSearch}
            placeholder={`Search in ${categoryName}...`}
            autoCapitalize="none"
            returnKeyType="search"
            elevated={false}
            leftIcon={<Icon name={icons.search} size={18} color={colors.primary} />}
            style={{ backgroundColor: colors.muted, borderRadius: 14 }}
          />
        </View>

        {/* Recipes Grid */}
        <FlatList
          data={recipes}
          keyExtractor={(item, index) =>
            item.uuid != null ? item.uuid : String(index)
          }
          numColumns={2}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 128,
            gap: 16,
          }}
          columnWrapperStyle={{ gap: 16 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <PopularRecipeCard
              item={toPopularRecipe(item)}
              onPress={() => router.push(`/recipe/${item.uuid}`)}
            />
          )}
          ListHeaderComponent={
            categoryQuery.isError || (recipesQuery.isError && recipes.length > 0) ? (
              <View style={{ marginBottom: 16 }}>
                <QueryErrorState
                  compact
                  isRetrying={recipesQuery.isFetching || categoryQuery.isFetching}
                  message="Some category content could not be refreshed."
                  onRetry={() =>
                    Promise.all([categoryQuery.refetch(), recipesQuery.refetch()])
                  }
                />
              </View>
            ) : null
          }
          ListEmptyComponent={
            hasInitialError ? (
              <QueryErrorState
                isRetrying={recipesQuery.isFetching || categoryQuery.isFetching}
                message="We could not load recipes for this category."
                onRetry={() =>
                  Promise.all([categoryQuery.refetch(), recipesQuery.refetch()])
                }
              />
            ) : isLoading ? (
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16 }}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <View key={i} style={{ flex: 1, gap: 12, minWidth: "45%" }}>
                    <Skeleton
                      style={{ height: 176, width: "100%", borderRadius: 14 }}
                    />
                    <Skeleton
                      style={{ height: 16, width: "75%", borderRadius: 9999 }}
                    />
                    <Skeleton
                      style={{ height: 12, width: "50%", borderRadius: 9999 }}
                    />
                  </View>
                ))}
              </View>
            ) : (
              <View style={{ alignItems: "center", paddingVertical: 64 }}>
                <Text
                  style={[{ color: colors.mutedForeground }, { fontSize: 17 }]}
                >
                  No recipes found in this category
                </Text>
              </View>
            )
          }
        />
      </View>
    </RequireAuth>
  );
}
