import { Icon, icons } from "@/components/Universal/icon";
import { NumericStepper } from "@/components/ui/stepper";
import { Text } from "@/components/Universal/text";
import { useTheme } from "@/context/theme.context";
import { useController, type Control } from "react-hook-form";
import { View } from "react-native";
import type { CreateRecipeFormValues } from "../../../resolvers/create-recipe.resolver";
import { ErrorText } from "./error-text";

export function ServingsField({
  control,
  step = 1,
}: {
  control: Control<CreateRecipeFormValues>;
  step?: number;
}) {
  const { colors } = useTheme();
  const { field, fieldState } = useController({
    control,
    name: "servings",
  });

  const hasError = !!fieldState.error;

  return (
    <View style={{ flex: 1, gap: 8 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        <Icon name={icons.users} size={14} color={colors.mutedForeground} />
        <Text
          style={[{ color: colors.mutedForeground }, { fontSize: 13, fontWeight: "500" }]}
        >
          Servings
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <NumericStepper
          value={field.value}
          onChange={field.onChange}
          min={1}
          max={100}
          step={step}
          hasError={hasError}
        />
      </View>
      {fieldState.error ? (
        <ErrorText message={fieldState.error.message ?? ""} />
      ) : null}
    </View>
  );
}
