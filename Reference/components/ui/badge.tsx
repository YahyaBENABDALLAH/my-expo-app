import { TextStyleContext } from "@/components/Universal/text";
import type { ColorTokens } from "@/constants/theme.colors";
import { FONT_SIZE, FONT_WEIGHT } from "@/constants/theme.tokens";
import { useTheme } from "@/context/theme.context";
import type { UniversalTextStyle } from "@expo/ui";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

export type BadgeVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "outline";

function getBadgeStyle(variant: BadgeVariant, colors: ColorTokens): ViewStyle {
  switch (variant) {
    case "secondary":
      return { backgroundColor: colors.secondary, borderColor: "transparent" };
    case "destructive":
      return {
        backgroundColor: colors.destructive,
        borderColor: "transparent",
      };
    case "outline":
      return { backgroundColor: "transparent", borderColor: colors.border };
    default:
      return { backgroundColor: colors.primary, borderColor: "transparent" };
  }
}

function getBadgeTextStyle(
  variant: BadgeVariant,
  colors: ColorTokens,
): UniversalTextStyle {
  const base: UniversalTextStyle = {
    fontSize: FONT_SIZE.tiny,
    fontWeight: FONT_WEIGHT.medium,
  };
  switch (variant) {
    case "secondary":
      return { ...base, color: colors.secondaryForeground };
    case "destructive":
      return { ...base, color: "#ffffff" };
    case "outline":
      return { ...base, color: colors.foreground };
    default:
      return { ...base, color: colors.primaryForeground };
  }
}

type BadgeProps = Omit<React.ComponentProps<typeof View>, "style"> & {
  variant?: BadgeVariant;
  style?: StyleProp<ViewStyle>;
};

function Badge({ style, variant = "default", ...props }: BadgeProps) {
  const { colors } = useTheme();
  return (
    <TextStyleContext value={getBadgeTextStyle(variant, colors)}>
      <View
        style={[styles.base, getBadgeStyle(variant, colors), style]}
        {...props}
      />
    </TextStyleContext>
  );
}

const styles = StyleSheet.create({
  base: {
    flexShrink: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    overflow: "hidden",
    borderRadius: 9999,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
});

export { Badge };
export type { BadgeProps };
