import { Icon, icons } from "@/components/Universal/icon";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/Universal/text";
import { useTheme } from "@/context/theme.context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useChefProfileDetailQuery } from "@/services/chef-profile/chef-profile.queries";
import { useIngredientDetailQuery } from "@/services/ingredient/ingredient.queries";
import { useGlobalSearchParams } from "expo-router";
import { DrawerContentComponentProps } from "expo-router/drawer";
import { ReactNode } from "react";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";

type DrawerItemType = "ingredient" | "chef";

export function RecipeDrawerContent(props: DrawerContentComponentProps) {
  const themeMode = useColorScheme();
  const { colors } = useTheme();

  const { showDrawer, itemId } = useGlobalSearchParams<{
    showDrawer?: DrawerItemType;
    itemId?: string;
  }>();

  const isDark = themeMode === "dark";
  const iconColor = isDark ? "#66aaf9" : "#006fee";

  // Queries
  const { data: ingredient, isPending: isIngredientPending } =
    useIngredientDetailQuery(
      showDrawer === "ingredient" && itemId ? itemId : "",
    );

  const { data: chef, isPending: isChefPending } = useChefProfileDetailQuery(
    showDrawer === "chef" && itemId ? itemId : "",
  );

  const handleClose = () => {
    props.navigation.closeDrawer();
  };

  const isLoading =
    (showDrawer === "ingredient" && isIngredientPending) ||
    (showDrawer === "chef" && isChefPending);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        borderLeftWidth: 1,
        borderColor: colors.border,
        paddingTop: 16,
        paddingBottom: 16,
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          paddingBottom: 16,
          borderBottomWidth: 1,
          borderColor: colors.border,
        }}
      >
        <Text
          style={[{ color: colors.foreground }, { fontSize: 18, fontWeight: "700", letterSpacing: 0.5 }]}
        >
          {showDrawer === "chef" ? "Chef Info" : "Ingredient Info"}
        </Text>
        <Pressable
          onPress={handleClose}
          style={{
            width: 32,
            height: 32,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 9999,
            backgroundColor: colors.muted,
          }}
        >
          <Icon name={icons.close} size={18} color={colors.mutedForeground} />
        </Pressable>
      </View>

      {/* Content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: 64 }}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 80,
            }}
          >
            <ActivityIndicator size="small" color={iconColor} />
          </View>
        ) : showDrawer === "chef" && chef ? (
          <View style={{ gap: 24 }}>
            {/* Chef Profile Header */}
            <View style={{ alignItems: "center", gap: 12 }}>
              {chef.profileImageUrl ? (
                <Image
                  source={{ uri: chef.profileImageUrl }}
                  contentFit="cover"
                  transition={200}
                  style={{
                    width: 96,
                    height: 96,
                    borderRadius: 9999,
                    borderWidth: 2,
                    borderColor: colors.primary,
                  }}
                />
              ) : (
                <View
                  style={{
                    width: 96,
                    height: 96,
                    borderRadius: 9999,
                    backgroundColor: colors.muted,
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 2,
                    borderColor: colors.primary,
                  }}
                >
                  <Icon name={icons.chef} size={40} color={colors.primary} />
                </View>
              )}
              <Text
                style={[{ color: colors.foreground }, {
                  fontSize: 20,
                  fontWeight: "700",
                  textAlign: "center",
                }]}
              >
                {chef.displayName}
              </Text>
              {chef.isVerified && (
                <View
                  style={{
                    borderRadius: 9999,
                    backgroundColor: colors.primary,
                    paddingHorizontal: 12,
                    paddingVertical: 2,
                    borderWidth: 1,
                    borderColor: colors.primary,
                  }}
                >
                  <Text
                    style={[{ color: colors.primary }, { fontSize: 12, fontWeight: "600" }]}
                  >
                    Verified Chef
                  </Text>
                </View>
              )}
            </View>

            {/* Chef Details List */}
            <View
              style={{
                gap: 16,
                paddingTop: 16,
                borderTopWidth: 1,
                borderColor: colors.border,
              }}
            >
              {chef.specialty && (
                <DetailRow
                  icon={<Icon name={icons.award} size={18} color={colors.primary} />}
                  label="Specialty"
                  value={chef.specialty}
                />
              )}
              {chef.yearsOfExperience != null && (
                <DetailRow
                  icon={<Icon name={icons.calendar} size={18} color={colors.primary} />}
                  label="Experience"
                  value={`${chef.yearsOfExperience} years`}
                />
              )}
            </View>

            {/* Chef Bio */}
            {chef.bio && (
              <View
                style={{
                  gap: 8,
                  paddingTop: 16,
                  borderTopWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <Text
                  style={[{ color: colors.mutedForeground }, {
                    fontSize: 12,
                    fontWeight: "600",
                    letterSpacing: 1,
                  }]}
                >
                  Bio
                </Text>
                <Text
                  style={[{ color: colors.foreground }, { fontSize: 14, lineHeight: 24 }]}
                >
                  {chef.bio}
                </Text>
              </View>
            )}
          </View>
        ) : showDrawer === "ingredient" && ingredient ? (
          <View style={{ gap: 24 }}>
            {/* Ingredient Header */}
            <View style={{ alignItems: "center", gap: 8 }}>
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 9999,
                  backgroundColor: colors.muted,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon name={icons.layers} size={32} color={colors.primary} />
              </View>
              <Text
                style={[{ color: colors.foreground }, {
                  fontSize: 20,
                  fontWeight: "700",
                  textAlign: "center",
                }]}
              >
                {ingredient.name}
              </Text>
              {ingredient.ingredientTypeLabel && (
                <View
                  style={{
                    borderRadius: 9999,
                    backgroundColor: colors.secondary,
                    paddingHorizontal: 12,
                    paddingVertical: 2,
                  }}
                >
                  <Text
                    style={[{ color: colors.secondary }, { fontSize: 12, fontWeight: "500" }]}
                  >
                    {ingredient.ingredientTypeLabel}
                  </Text>
                </View>
              )}
            </View>

            {/* Ingredient Details List */}
            <View
              style={{
                gap: 16,
                paddingTop: 16,
                borderTopWidth: 1,
                borderColor: colors.border,
              }}
            >
              {ingredient.caloriesPer100g != null && (
                <DetailRow
                  icon={<Icon name={icons.flame} size={18} color={colors.primary} />}
                  label="Calories"
                  value={`${ingredient.caloriesPer100g} kcal / 100g`}
                />
              )}
              {ingredient.defaultUnitLabel && (
                <DetailRow
                  icon={<Icon name={icons.scale} size={18} color={colors.primary} />}
                  label="Default Unit"
                  value={ingredient.defaultUnitLabel}
                />
              )}
            </View>
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 80,
            }}
          >
            <Text
              style={[{ color: colors.mutedForeground }, { textAlign: "center" }]}
            >
              Select an ingredient or chef to view details
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

interface DetailRowProps {
  icon: ReactNode;
  label: string;
  value: string;
}

function DetailRow({ icon, label, value }: DetailRowProps) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 9999,
          backgroundColor: colors.muted,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={[{ color: colors.mutedForeground }, { fontSize: 12 }]}
        >
          {label}
        </Text>
        <Text
          style={[{ color: colors.foreground }, { fontSize: 14, fontWeight: "600" }]}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}
