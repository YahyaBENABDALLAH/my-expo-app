import { ControlledTextInput } from "@/components/Universal/text-input";
import { Icon, icons } from "@/components/Universal/icon";
import { Card } from "@/components/ui/surface";
import { Text } from "@/components/Universal/text";
import { useTheme } from "@/context/theme.context";
import {
  Controller,
  useFieldArray,
  type Control,
  type FieldErrors,
} from "react-hook-form";
import { Pressable, View } from "react-native";
import type { CreateRecipeFormValues } from "../../../resolvers/create-recipe.resolver";

export function StepsField({
  control,
  errors,
}: {
  control: Control<CreateRecipeFormValues>;
  errors?: FieldErrors<CreateRecipeFormValues>;
}) {
  const { colors } = useTheme();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "steps",
  });

  const inputStyle = {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    paddingHorizontal: 14,
    paddingVertical: 10,
  };

  return (
    <View style={{ gap: 16 }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Icon name={icons.listOrdered} size={18} color={colors.mutedForeground} />
          <Text
            style={[{ color: colors.secondary }, { fontSize: 16, fontWeight: "600" }]}
          >
            {`Preparation Steps${fields.length > 0 ? ` (${fields.length})` : ""}`}
          </Text>
        </View>
      </View>

      {/* Steps List */}
      {fields.length === 0 ? (
        <Card
          elevation="none"
          outlined
          style={{
            alignItems: "center",
            justifyContent: "center",
            borderStyle: "dashed",
            padding: 24,
          }}
        >
          <Text
            style={[{ color: colors.mutedForeground }, { textAlign: "center", fontSize: 14 }]}
          >
            No steps added yet. Add steps to guide chefs through your recipe.
          </Text>
        </Card>
      ) : (
        <View style={{ gap: 16 }}>
          {fields.map((field, index) => {
            const stepErrors = errors?.steps?.[index];

            return (
              <Card
                key={field.id}
                elevation="none"
                outlined
                style={{
                  gap: 12,
                  padding: 16,
                }}
              >
                {/* Step Header */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={[{ color: colors.secondary }, { fontSize: 16, fontWeight: "700" }]}
                  >
                    {`Step ${index + 1}`}
                  </Text>
                  <Pressable
                    accessibilityLabel={`Remove step ${index + 1}`}
                    accessibilityRole="button"
                    onPress={() => remove(index)}
                    hitSlop={12}
                  >
                    <Icon name={icons.trash} size={18} color={colors.destructive} />
                  </Pressable>
                </View>

                {/* Step Title (Optional) */}
                <View style={{ gap: 6 }}>
                  <Text
                    style={[{ color: colors.mutedForeground }, { fontSize: 13, fontWeight: "600" }]}
                  >
                    Title (Optional)
                  </Text>
                  <Controller
                    control={control}
                    name={`steps.${index}.title`}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <ControlledTextInput
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="e.g. Preparing vegetables"
                        style={inputStyle}
                        maxLength={150}
                        error={stepErrors?.title?.message}
                      />
                    )}
                  />
                </View>

                {/* Step Instruction (Required) */}
                <View style={{ gap: 6 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Text
                      style={[{ color: colors.mutedForeground }, { fontSize: 13, fontWeight: "600" }]}
                    >
                      Instructions
                    </Text>
                    <Text
                      style={[{ color: colors.destructive }, { fontSize: 13, fontWeight: "600" }]}
                    >
                      *
                    </Text>
                  </View>
                  <Controller
                    control={control}
                    name={`steps.${index}.instruction`}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <ControlledTextInput
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="Describe what to do in this step..."
                        style={{ ...inputStyle, height: 80 }}
                        multiline
                        maxLength={2000}
                        error={stepErrors?.instruction?.message}
                      />
                    )}
                  />
                </View>

                {/* Step Duration (Optional) */}
                <View style={{ gap: 6 }}>
                  <Text
                    style={[{ color: colors.mutedForeground }, { fontSize: 13, fontWeight: "600" }]}
                  >
                    Duration (Minutes)
                  </Text>
                  <Controller
                    control={control}
                    name={`steps.${index}.durationMinutes`}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <ControlledTextInput
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="e.g. 15"
                        keyboardType="number-pad"
                        style={{ ...inputStyle, width: 128 }}
                        maxLength={4}
                        error={stepErrors?.durationMinutes?.message}
                      />
                    )}
                  />
                </View>
              </Card>
            );
          })}
        </View>
      )}

      {/* Add Step Button */}
      <Pressable
        accessibilityLabel="Add step"
        accessibilityRole="button"
        onPress={() =>
          append({ title: "", instruction: "", durationMinutes: "" })
        }
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          borderRadius: 12,
          backgroundColor: colors.primary,
          paddingVertical: 12,
        }}
      >
        <Icon
          name={icons.plus}
          size={16}
          color={colors.primaryForeground}
        />
        <Text
          style={[{ color: colors.primaryForeground }, { fontSize: 16, fontWeight: "600" }]}
        >
          Add Step
        </Text>
      </Pressable>
    </View>
  );
}
