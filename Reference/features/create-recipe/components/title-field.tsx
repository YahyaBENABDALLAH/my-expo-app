import { ControlledTextInput } from "@/components/Universal/text-input";
import { Text } from "@/components/Universal/text";
import { useTheme } from "@/context/theme.context";
import { useController, type Control } from "react-hook-form";
import { View } from "react-native";
import type { CreateRecipeFormValues } from "../../../resolvers/create-recipe.resolver";

export function TitleField({
  control,
}: {
  control: Control<CreateRecipeFormValues>;
}) {
  const { colors } = useTheme();
  const {
    field: { value, onChange, onBlur, ref },
    fieldState,
  } = useController({
    control,
    name: "title",
  });

  return (
    <View style={{ gap: 8 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
        <Text
          style={[{ color: colors.secondary }, { fontSize: 14, fontWeight: "600" }]}
        >
          Recipe Title
        </Text>
        <Text
          style={[{ color: colors.destructive }, { fontSize: 14, fontWeight: "600" }]}
        >
          *
        </Text>
      </View>

      <ControlledTextInput
        value={value}
        onChangeText={onChange}
        onBlur={onBlur}
        ref={ref}
        placeholder="e.g. Grandma's Chicken Tagine"
        maxLength={200}
        autoCapitalize="sentences"
        error={fieldState.error?.message}
      />
    </View>
  );
}
