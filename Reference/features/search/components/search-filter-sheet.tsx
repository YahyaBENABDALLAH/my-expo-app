import { BottomSheet } from "@/components/Universal/bottom-sheet";
import { Button } from "@/components/Universal/button";
import { RNHostView } from "@/components/Universal/rn-host-view";
import { Text } from "@/components/Universal/text";
import { QueryErrorState } from "@/components/query-error-state";
import { Skeleton } from "@/components/skeleton/skeleton";
import { CategoryBadge } from "@/components/ui/category-badge";
import { useTheme } from "@/context/theme.context";
import type { CuisineItem } from "@/types/cuisine.types";
import type { DifficultyItem } from "@/types/difficulty.types";
import type { FoodCategoryItem } from "@/types/food-category.types";
import { ScrollView, View } from "react-native";

interface SearchFilterSelection {
  categoryUuid?: string;
  cuisineUuid?: string;
  difficultyUuid?: string;
}

type FilterOption = Pick<CuisineItem, "iconUrl" | "name" | "uuid">;

function FilterRow({
  isError,
  isLoading,
  isRetrying,
  onRetry,
  onSelect,
  options,
  selectedUuid,
  skeletonCount,
  title,
}: {
  isError: boolean;
  isLoading: boolean;
  isRetrying: boolean;
  onRetry: () => unknown;
  onSelect: (uuid?: string) => void;
  options: readonly FilterOption[];
  selectedUuid?: string;
  skeletonCount: number;
  title: string;
}) {
  const { colors } = useTheme();

  return (
    <View style={{ gap: 8 }}>
      <Text style={[{ color: colors.secondary }, { fontSize: 20, fontWeight: "700" }]}>
        {title}
      </Text>
      {isError && options.length > 0 ? (
        <View style={{ paddingHorizontal: 16 }}>
          <QueryErrorState
            compact
            isRetrying={isRetrying}
            message={`${title} options could not be refreshed. Showing saved content.`}
            onRetry={onRetry}
          />
        </View>
      ) : null}
      {isError && options.length === 0 ? (
        <View style={{ paddingHorizontal: 16 }}>
          <QueryErrorState
            compact
            isRetrying={isRetrying}
            message={`We could not load ${title.toLowerCase()} options.`}
            onRetry={onRetry}
          />
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}
        >
          {isLoading
            ? Array.from({ length: skeletonCount }).map((_, index) => (
                <Skeleton key={index} style={{ borderRadius: 9999, height: 32, width: 80 }} />
              ))
            : options.map((option) => {
                const isSelected = selectedUuid === option.uuid;
                return (
                  <CategoryBadge
                    key={option.uuid}
                    name={option.name}
                    iconUrl={option.iconUrl}
                    isSelected={isSelected}
                    onPress={() => onSelect(isSelected ? undefined : option.uuid)}
                  />
                );
              })}
        </ScrollView>
      )}
    </View>
  );
}

export function SearchFilterSheet({
  categories,
  categoriesError,
  categoriesLoading,
  categoriesRetrying,
  cuisines,
  cuisinesError,
  cuisinesLoading,
  cuisinesRetrying,
  difficulties,
  difficultiesError,
  difficultiesLoading,
  difficultiesRetrying,
  onApply,
  onDismiss,
  onRetryCategories,
  onRetryCuisines,
  onRetryDifficulties,
  onReset,
  onSelectionChange,
  selection,
  visible,
}: {
  categories: readonly FoodCategoryItem[];
  categoriesError: boolean;
  categoriesLoading: boolean;
  categoriesRetrying: boolean;
  cuisines: readonly CuisineItem[];
  cuisinesError: boolean;
  cuisinesLoading: boolean;
  cuisinesRetrying: boolean;
  difficulties: readonly DifficultyItem[];
  difficultiesError: boolean;
  difficultiesLoading: boolean;
  difficultiesRetrying: boolean;
  onApply: () => void;
  onDismiss: () => void;
  onRetryCategories: () => unknown;
  onRetryCuisines: () => unknown;
  onRetryDifficulties: () => unknown;
  onReset: () => void;
  onSelectionChange: (selection: SearchFilterSelection) => void;
  selection: SearchFilterSelection;
  visible: boolean;
}) {
  const { colors } = useTheme();

  return (
    <BottomSheet
      contentPadding={0}
      isPresented={visible}
      onDismiss={onDismiss}
      snapPoints={[{ fraction: 0.8 }]}
    >
      <RNHostView>
        <View style={{ flex: 1, gap: 24, paddingBottom: 40 }}>
          <View style={{ gap: 24 }}>
            <FilterRow
              isError={cuisinesError}
              isLoading={cuisinesLoading}
              isRetrying={cuisinesRetrying}
              onRetry={onRetryCuisines}
              onSelect={(cuisineUuid) => onSelectionChange({ ...selection, cuisineUuid })}
              options={cuisines}
              selectedUuid={selection.cuisineUuid}
              skeletonCount={4}
              title="Cuisine"
            />
            <FilterRow
              isError={difficultiesError}
              isLoading={difficultiesLoading}
              isRetrying={difficultiesRetrying}
              onRetry={onRetryDifficulties}
              onSelect={(difficultyUuid) => onSelectionChange({ ...selection, difficultyUuid })}
              options={difficulties}
              selectedUuid={selection.difficultyUuid}
              skeletonCount={3}
              title="Difficulty"
            />
            <FilterRow
              isError={categoriesError}
              isLoading={categoriesLoading}
              isRetrying={categoriesRetrying}
              onRetry={onRetryCategories}
              onSelect={(categoryUuid) => onSelectionChange({ ...selection, categoryUuid })}
              options={categories}
              selectedUuid={selection.categoryUuid}
              skeletonCount={4}
              title="Category"
            />
          </View>
          <View style={{ flexDirection: "row", gap: 16, justifyContent: "space-between", paddingHorizontal: 16 }}>
            <Button
              fullWidth
              onPress={onReset}
              semantic="destructive"
              containerStyle={{ flex: 1 }}
              style={{ borderColor: colors.mutedForeground }}
              label="Reset"
            />
            <Button
              fullWidth
              onPress={onApply}
              containerStyle={{ flex: 1 }}
              style={{ borderColor: colors.mutedForeground }}
              label="Apply"
            />
          </View>
        </View>
      </RNHostView>
    </BottomSheet>
  );
}

export type { SearchFilterSelection };
