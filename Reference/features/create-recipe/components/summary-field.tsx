import { ControlledTextInput } from "@/components/Universal/text-input";
import { Text } from "@/components/Universal/text";
import { useTheme } from "@/context/theme.context";
import { useController, type Control } from "react-hook-form";
import { View } from "react-native";
import type { CreateRecipeFormValues } from "../../../resolvers/create-recipe.resolver";

export function SummaryField({
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
    name: "summary",
  });

  return (
    <View style={{ gap: 8 }}>
      <Text
        style={[{ color: colors.secondary }, { fontSize: 14, fontWeight: "600" }]}
      >
        Summary
      </Text>
      <ControlledTextInput
        value={value}
        onChangeText={onChange}
        onBlur={onBlur}
        ref={ref}
        placeholder="A short description of your recipe..."
        style={{ height: 100 }}
        multiline
        maxLength={1000}
        error={fieldState.error?.message}
      />
    </View>
  );
}
