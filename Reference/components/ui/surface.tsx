import { TextStyleContext } from "@/components/Universal/text";
import { RADIUS } from "@/constants/theme.tokens";
import { useTheme } from "@/context/theme.context";
import type { PropsWithChildren } from "react";
import {
  Pressable,
  type PressableProps,
  type StyleProp,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native";

export type SurfaceElevation = "none" | "item" | "card" | "floating";
export type SurfaceTone = "background" | "card" | "muted";

export interface SurfaceProps
  extends PropsWithChildren<Omit<PressableProps, "children" | "style">> {
  elevation?: SurfaceElevation;
  outlined?: boolean;
  radius?: number;
  style?: StyleProp<ViewStyle>;
  tone?: SurfaceTone;
}

/** Shared themed surface for React Native content. */
function Surface({
  accessibilityRole,
  accessible,
  children,
  elevation = "none",
  onPress,
  outlined = false,
  pointerEvents,
  radius = RADIUS.large,
  style,
  tone = "card",
  ...props
}: SurfaceProps) {
  const { colors, tokens } = useTheme();
  const shadow =
    elevation === "item"
      ? tokens.shadows.item
      : elevation === "card"
        ? tokens.shadows.card
        : elevation === "floating"
          ? tokens.shadows.floatingAction
          : null;
  const foregroundColor =
    tone === "muted"
      ? colors.mutedForeground
      : tone === "background"
        ? colors.foreground
        : colors.cardForeground;
  const surfaceStyle: StyleProp<ViewStyle> = [
    {
      alignSelf: "stretch",
      backgroundColor: colors[tone],
      borderColor: outlined ? colors.border : "transparent",
      borderRadius: radius,
      borderWidth: outlined ? 1 : 0,
    },
    shadow,
    style,
  ];

  const content = (
    <TextStyleContext value={{ color: foregroundColor }}>
      {children}
    </TextStyleContext>
  );

  // A presentational card must not create a nested touch responder when it is
  // placed inside the pressable that owns the card action.
  if (!onPress) {
    return (
      <View
        accessibilityRole={accessibilityRole}
        accessible={accessible}
        pointerEvents={pointerEvents}
        style={surfaceStyle}
        {...(props as ViewProps)}
      >
        {content}
      </View>
    );
  }

  return (
    <Pressable
      accessibilityRole={accessibilityRole ?? "button"}
      accessible={accessible ?? true}
      onPress={onPress}
      pointerEvents={pointerEvents ?? "box-only"}
      style={surfaceStyle}
      {...props}
    >
      {content}
    </Pressable>
  );
}

export function Card({ elevation = "card", ...props }: SurfaceProps) {
  return <Surface elevation={elevation} {...props} />;
}
