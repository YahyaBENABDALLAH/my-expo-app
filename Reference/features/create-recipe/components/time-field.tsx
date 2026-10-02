import { Icon, icons } from "@/components/Universal/icon";
import { NumericStepper } from "@/components/ui/stepper";
import { Text } from "@/components/Universal/text";
import { useTheme } from "@/context/theme.context";
import { useController, type Control } from "react-hook-form";
import { View } from "react-native";
import type { CreateRecipeFormValues } from "../../../resolvers/create-recipe.resolver";
import { ErrorText } from "./error-text";

export const TIME_FIELD_NAME = {
  PREP: "prepTimeMinutes",
  COOK: "cookTimeMinutes",
} as const;
export type TimeFieldName =
  (typeof TIME_FIELD_NAME)[keyof typeof TIME_FIELD_NAME];

export function TimeField({
  control,
  name,
  label,
  step = 5,
}: {
  control: Control<CreateRecipeFormValues>;
  name: TimeFieldName;
  label: string;
  step?: number;
}) {
  const { colors } = useTheme();
  const { field, fieldState } = useController({ control, name });
  const hasError = !!fieldState.error;

  return (
    <View style={{ flex: 1, gap: 8 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        <Icon name={icons.clock} size={14} color={colors.mutedForeground} />
        <Text
          style={[{ color: colors.mutedForeground }, { fontSize: 13, fontWeight: "500" }]}
        >
          {label}
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
          onChange={(val) => field.onChange(String(val))}
          min={0}
          max={1440}
          step={step}
          hasError={hasError}
          allowEmpty
        />
      </View>
      {fieldState.error ? (
        <ErrorText message={fieldState.error.message ?? ""} />
      ) : null}
    </View>
  );
}
