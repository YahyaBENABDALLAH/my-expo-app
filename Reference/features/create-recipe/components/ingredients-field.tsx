import { Switch } from "@/components/Universal/switch";
import { ControlledTextInput } from "@/components/Universal/text-input";
import { Icon, icons } from "@/components/Universal/icon";
import { QueryErrorState } from "@/components/query-error-state";
import { Card } from "@/components/ui/surface";
import { Text } from "@/components/Universal/text";
import { useTheme } from "@/context/theme.context";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useIngredientListQuery } from "@/services/ingredient/ingredient.queries";
import { useUnitListQuery } from "@/services/unit/unit.queries";
import { useState } from "react";
import {
  Controller,
  useFieldArray,
  type Control,
  type FieldErrors,
  type UseFormSetValue,
} from "react-hook-form";
import { FlatList, Modal, Pressable, ScrollView, View } from "react-native";
import type { CreateRecipeFormValues } from "../../../resolvers/create-recipe.resolver";

export function IngredientsField({
  control,
  errors,
  setValue,
}: {
  control: Control<CreateRecipeFormValues>;
  errors?: FieldErrors<CreateRecipeFormValues>;
  setValue: UseFormSetValue<CreateRecipeFormValues>;
}) {
  const { colors } = useTheme();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredients",
  });

  // Local lookup for ingredient names (caches display names for selected UUIDs)
  const [ingredientNames, setIngredientNames] = useState<
    Record<string, string>
  >({});

  // Ingredient lookup modal states
  const [searchIndex, setSearchIndex] = useState<number | null>(null);
  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebouncedValue(searchText, 300);

  // Queries
  const unitsQuery = useUnitListQuery({ isActive: true, pageSize: 50 });
  const units = unitsQuery.data?.data ?? [];

  // Searching ingredients via service
  const ingredientsQuery = useIngredientListQuery(
    {
      search: debouncedSearchText.trim() || undefined,
      isActive: true,
      pageSize: 30,
    },
    { enabled: searchIndex !== null },
  );
  const searchResults = ingredientsQuery.data?.data ?? [];

  const inputStyle = {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    paddingHorizontal: 14,
    paddingVertical: 10,
  };

  const labelTextStyle = {
    fontSize: 13,
    fontWeight: "600" as const,
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
          <Icon name={icons.food} size={18} color={colors.mutedForeground} />
          <Text
            style={[{ color: colors.secondary }, { fontSize: 16, fontWeight: "600" }]}
          >
            {`Ingredients${fields.length > 0 ? ` (${fields.length})` : ""}`}
          </Text>
        </View>
      </View>

      {unitsQuery.isError && units.length === 0 ? (
        <QueryErrorState
          compact
          isRetrying={unitsQuery.isFetching}
          message="We could not load measurement units. You can retry or leave units empty."
          onRetry={unitsQuery.refetch}
        />
      ) : null}

      {/* Ingredients List */}
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
            No ingredients added yet. Add Ingredient below to start listing
            recipe ingredients.
          </Text>
        </Card>
      ) : (
        <View style={{ gap: 16 }}>
          {fields.map((field, index) => {
            const ingredientErrors = errors?.ingredients?.[index];

            return (
              <Card
                key={field.id}
                elevation="none"
                outlined
                style={{
                  gap: 14,
                  padding: 16,
                }}
              >
                {/* Ingredient Item Header */}
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
                    {`Ingredient #${index + 1}`}
                  </Text>
                  <Pressable
                    accessibilityLabel={`Remove ingredient ${index + 1}`}
                    accessibilityRole="button"
                    onPress={() => remove(index)}
                    hitSlop={12}
                  >
                    <Icon name={icons.trash} size={18} color={colors.destructive} />
                  </Pressable>
                </View>

                {/* Ingredient Search Trigger Button (Controller bound) */}
                <View style={{ gap: 6 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Text
                      style={[{ color: colors.mutedForeground }, labelTextStyle]}
                    >
                      Ingredient
                    </Text>
                    <Text
                      style={[{ color: colors.destructive }, labelTextStyle]}
                    >
                      *
                    </Text>
                  </View>
                  <Controller
                    control={control}
                    name={`ingredients.${index}.ingredientUuid`}
                    render={({ field: { value } }) => (
                      <Pressable
                        accessibilityLabel={
                          typeof value === "string" && value
                            ? `Change ingredient, ${ingredientNames[value] || "selected ingredient"}`
                            : "Select ingredient"
                        }
                        accessibilityRole="button"
                        onPress={() => {
                          setSearchIndex(index);
                          setSearchText("");
                        }}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                          borderRadius: 14,
                          borderWidth: 1,
                          borderColor: colors.border,
                          backgroundColor: colors.background,
                          paddingHorizontal: 16,
                          paddingVertical: 12,
                        }}
                      >
                        <Text
                          style={[{
                            color: value
                              ? colors.foreground
                              : colors.mutedForeground,
                          }, {
                            fontSize: 16,
                            fontWeight: value ? "600" : "400",
                          }]}
                        >
                          {typeof value === "string" && value
                            ? ingredientNames[value] || "Select an Ingredient"
                            : "Select an Ingredient"}
                        </Text>
                        <Icon
                          name={icons.search}
                          size={16}
                          color={colors.mutedForeground}
                        />
                      </Pressable>
                    )}
                  />
                  {ingredientErrors?.ingredientUuid ? (
                    <View style={{ marginTop: 4 }}>
                      <Text
                        style={[{ color: "#ef4444" }, { fontSize: 12 }]}
                      >
                        {ingredientErrors.ingredientUuid.message}
                      </Text>
                    </View>
                  ) : null}
                </View>

                {/* Quantity (Controller bound) */}
                <View style={{ gap: 6 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Text
                      style={[{ color: colors.mutedForeground }, labelTextStyle]}
                    >
                      Quantity
                    </Text>
                    <Text
                      style={[{ color: colors.destructive }, labelTextStyle]}
                    >
                      *
                    </Text>
                  </View>
                  <Controller
                    control={control}
                    name={`ingredients.${index}.quantity`}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <ControlledTextInput
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="e.g. 200, 1.5"
                        keyboardType="numeric"
                        style={inputStyle}
                        error={ingredientErrors?.quantity?.message}
                      />
                    )}
                  />
                </View>

                {/* Unit Chips Selection (Controller bound) */}
                <View style={{ gap: 6 }}>
                  <Text
                    style={[{ color: colors.mutedForeground }, labelTextStyle]}
                  >
                    Unit (Optional)
                  </Text>
                  <Controller
                    control={control}
                    name={`ingredients.${index}.unitUuid`}
                    render={({ field: { onChange, value } }) => (
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ gap: 8, paddingBottom: 4 }}
                      >
                        {units.map((unit) => {
                          const isUnitSelected = value === unit.uuid;
                          return (
                            <Pressable
                              accessibilityLabel={unit.label ?? "Unnamed unit"}
                              accessibilityRole="button"
                              accessibilityState={{ selected: isUnitSelected }}
                              key={unit.uuid}
                              onPress={() => {
                                onChange(isUnitSelected ? "" : unit.uuid);
                              }}
                              style={{
                                borderRadius: 9999,
                                paddingHorizontal: 12,
                                paddingVertical: 6,
                                borderWidth: 1,
                                backgroundColor: isUnitSelected
                                  ? colors.primary
                                  : colors.background,
                                borderColor: isUnitSelected
                                  ? colors.primary
                                  : colors.border,
                              }}
                            >
                              <Text
                                style={[{
                                  color: isUnitSelected
                                    ? "#ffffff"
                                    : colors.secondary,
                                }, {
                                  fontSize: 13,
                                  fontWeight: "500",
                                }]}
                              >
                                {unit.label ?? ""}
                              </Text>
                            </Pressable>
                          );
                        })}
                      </ScrollView>
                    )}
                  />
                </View>

                {/* Notes (Controller bound) */}
                <View style={{ gap: 6 }}>
                  <Text
                    style={[{ color: colors.mutedForeground }, labelTextStyle]}
                  >
                    Notes (Optional)
                  </Text>
                  <Controller
                    control={control}
                    name={`ingredients.${index}.notes`}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <ControlledTextInput
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        placeholder="e.g. Finely chopped, melted"
                        style={inputStyle}
                        maxLength={250}
                        error={ingredientErrors?.notes?.message}
                      />
                    )}
                  />
                </View>

                {/* Optional Ingredient Toggle (Controller bound) */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingVertical: 4,
                  }}
                >
                  <View>
                    <Text
                      style={[{ color: colors.secondary }, { fontSize: 14, fontWeight: "600" }]}
                    >
                      Optional ingredient
                    </Text>
                    <Text
                      style={[{ color: colors.mutedForeground }, { fontSize: 12 }]}
                    >
                      Let users know if they can skip this
                    </Text>
                  </View>
                  <Controller
                    control={control}
                    name={`ingredients.${index}.isOptional`}
                    render={({ field: { onChange, value } }) => (
                      <Switch value={!!value} onValueChange={onChange} />
                    )}
                  />
                </View>
              </Card>
            );
          })}
        </View>
      )}

      {/* Add Ingredient Button */}
      <Pressable
        accessibilityLabel="Add ingredient"
        accessibilityRole="button"
        onPress={() =>
          append({
            ingredientUuid: "",
            quantity: "",
            unitUuid: "",
            isOptional: false,
            notes: "",
          })
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
          Add Ingredient
        </Text>
      </Pressable>

      {/* Ingredient Selector Modal */}
      <Modal
        visible={searchIndex !== null}
        animationType="slide"
        onRequestClose={() => setSearchIndex(null)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: colors.background,
            paddingHorizontal: 16,
            paddingTop: 48,
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingBottom: 16,
              paddingTop: 8,
            }}
          >
            <Text
              style={[{ color: colors.secondary }, { fontSize: 20, fontWeight: "700" }]}
            >
              Select Ingredient
            </Text>
            <Pressable
              accessibilityLabel="Close ingredient selector"
              accessibilityRole="button"
              onPress={() => setSearchIndex(null)}
              style={{
                borderRadius: 9999,
                backgroundColor: colors.card,
                padding: 6,
              }}
            >
              <Icon name={icons.close} size={20} color={colors.mutedForeground} />
            </Pressable>
          </View>

          {/* Search bar */}
          <ControlledTextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search ingredient (e.g. Chicken, Olive oil)..."
            autoFocus
            returnKeyType="search"
            elevated={false}
            leftIcon={
              <Icon name={icons.search} size={18} color={colors.mutedForeground} />
            }
            rightIcon={
              searchText.length > 0 ? (
                <Icon name={icons.close} size={18} color={colors.mutedForeground} />
              ) : undefined
            }
            onRightIconPress={
              searchText.length > 0 ? () => setSearchText("") : undefined
            }
            style={{
              borderRadius: 14,
              backgroundColor: colors.card,
              borderColor: colors.border,
            }}
          />

          {/* Search Results List */}
          {ingredientsQuery.isError && searchResults.length === 0 ? (
            <View style={{ flex: 1, justifyContent: "center", marginTop: 16 }}>
              <QueryErrorState
                isRetrying={ingredientsQuery.isFetching}
                message="We could not search the ingredient list."
                onRetry={ingredientsQuery.refetch}
              />
            </View>
          ) : ingredientsQuery.isPending ? (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={[{ color: colors.mutedForeground }, { fontSize: 15 }]}
              >
                Searching ingredients...
              </Text>
            </View>
          ) : searchResults.length === 0 ? (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <Text
                style={[{ color: colors.mutedForeground }, { fontSize: 15, textAlign: "center" }]}
              >
                {`No ingredients found for ${searchText}`}
              </Text>
            </View>
          ) : (
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.uuid}
              renderItem={({ item }) => (
                <Pressable
                  accessibilityLabel={`Select ${item.name}`}
                  accessibilityRole="button"
                  onPress={() => {
                    if (searchIndex !== null) {
                      setValue(
                        `ingredients.${searchIndex}.ingredientUuid`,
                        item.uuid,
                        {
                          shouldValidate: true,
                          shouldDirty: true,
                        },
                      );
                      setIngredientNames((prev) => ({
                        ...prev,
                        [item.uuid]: item.name,
                      }));
                      setSearchIndex(null);
                    }
                  }}
                  style={{
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                    paddingVertical: 16,
                    paddingHorizontal: 8,
                  }}
                >
                  <Text
                    style={[{ color: colors.foreground }, { fontSize: 16, fontWeight: "600" }]}
                  >
                    {item.name}
                  </Text>
                  {item.ingredientTypeLabel ? (
                    <View style={{ marginTop: 2 }}>
                      <Text
                        style={[{ color: colors.mutedForeground }, { fontSize: 13 }]}
                      >
                        {item.ingredientTypeLabel}
                      </Text>
                    </View>
                  ) : null}
                </Pressable>
              )}
              style={{ flex: 1, marginTop: 16 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </Modal>
    </View>
  );
}
