import { Skeleton } from "@/components/skeleton/skeleton";
import { CategoryBadge } from "@/components/ui/category-badge";
import { Icon, icons } from "@/components/Universal/icon";
import { Text } from "@/components/Universal/text";
import { useTheme } from "@/context/theme.context";
import type { CuisineItem } from "@/types/cuisine.types";
import { useController, type Control } from "react-hook-form";
import { ScrollView, View } from "react-native";
import type { CreateRecipeFormValues } from "../../../resolvers/create-recipe.resolver";

export function CuisineField({
  control,
  cuisines,
  isLoading,
}: {
  control: Control<CreateRecipeFormValues>;
  cuisines: Pick<CuisineItem, "iconUrl" | "name" | "uuid">[];
  isLoading: boolean;
}) {
  const { colors } = useTheme();
  const { field } = useController({
    control,
    name: "cuisineUuid",
  });

  return (
    <View style={{ gap: 10 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Icon name={icons.globe} size={16} color={colors.mutedForeground} />
        <Text
          style={[{ color: colors.secondary }, { fontSize: 14, fontWeight: "600" }]}
        >
          Cuisine
        </Text>
      </View>
      {isLoading ? (
        <View style={{ flexDirection: "row", gap: 8 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton
              key={i}
              style={{ height: 40, borderRadius: 9999, width: 80 }}
            />
          ))}
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingRight: 16 }}
        >
          {cuisines.map((cuisine) => {
            const isSelected = field.value === cuisine.uuid;
            return (
              <CategoryBadge
                key={cuisine.uuid}
                name={cuisine.name}
                iconUrl={cuisine.iconUrl}
                isSelected={isSelected}
                onPress={() => field.onChange(isSelected ? "" : cuisine.uuid)}
                inactiveStyle={{ backgroundColor: colors.card }}
                textStyle={{ fontSize: 14, fontWeight: "600" }}
              />
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}
