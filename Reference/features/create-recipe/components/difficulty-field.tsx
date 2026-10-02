import { Skeleton } from "@/components/skeleton/skeleton";
import { CategoryBadge } from "@/components/ui/category-badge";
import { Icon, icons } from "@/components/Universal/icon";
import { Text } from "@/components/Universal/text";
import { useTheme } from "@/context/theme.context";
import type { DifficultyItem } from "@/types/difficulty.types";
import { useController, type Control } from "react-hook-form";
import { View } from "react-native";
import type { CreateRecipeFormValues } from "../../../resolvers/create-recipe.resolver";
import { ErrorText } from "./error-text";

export function DifficultyField({
  control,
  difficulties,
  isLoading,
}: {
  control: Control<CreateRecipeFormValues>;
  difficulties: Pick<DifficultyItem, "iconUrl" | "name" | "uuid">[];
  isLoading: boolean;
}) {
  const { colors } = useTheme();
  const { field, fieldState } = useController({
    control,
    name: "difficultyUuid",
  });

  return (
    <View style={{ gap: 8 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Icon name={icons.chef} size={16} color={colors.mutedForeground} />
        <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
          <Text
            style={[{ color: colors.secondary }, { fontSize: 14, fontWeight: "600" }]}
          >
            Difficulty
          </Text>
          <Text
            style={[{ color: colors.destructive }, { fontSize: 14, fontWeight: "600" }]}
          >
            *
          </Text>
        </View>
      </View>
      {isLoading ? (
        <View style={{ flexDirection: "row", gap: 8 }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton
              key={i}
              style={{ height: 40, borderRadius: 9999, width: 90 }}
            />
          ))}
        </View>
      ) : (
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {difficulties.map((difficulty) => {
            const isSelected = field.value === difficulty.uuid;
            return (
              <CategoryBadge
                key={difficulty.uuid}
                name={difficulty.name}
                iconUrl={difficulty.iconUrl}
                isSelected={isSelected}
                onPress={() =>
                  field.onChange(isSelected ? "" : difficulty.uuid)
                }
                inactiveStyle={{ backgroundColor: colors.card }}
                textStyle={{ fontSize: 14, fontWeight: "600" }}
              />
            );
          })}
        </View>
      )}
      {fieldState.error ? (
        <ErrorText message={fieldState.error.message ?? ""} />
      ) : null}
    </View>
  );
}
