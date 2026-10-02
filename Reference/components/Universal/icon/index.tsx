import { WithinHostContext } from "@/components/Universal/host-context";
import { Host } from "@/components/Universal/host";
import { TextStyleContext } from "@/components/Universal/text";
import { useTheme } from "@/context/theme.context";
import { Icon as ExpoIcon, type IconProps as ExpoIconProps } from "@expo/ui";
import { useContext } from "react";

export type IconProps = ExpoIconProps;

/**
 * Canonical application icon.
 *
 * Glyphs are native SF Symbols on iOS and Material Symbols XML drawables on
 * Android. Product code supplies semantic names from the shared icon catalog.
 */
function IconComponent({ color, size, ...props }: IconProps) {
  const { tokens } = useTheme();
  const inherited = useContext(TextStyleContext);
  const withinHost = useContext(WithinHostContext);
  const iconNode = (
    <ExpoIcon
      color={color ?? inherited?.color ?? tokens.colors.foreground}
      size={size ?? tokens.iconSize.md}
      {...props}
    />
  );

  if (withinHost) {
    return iconNode;
  }

  return (
    <Host matchContents>{iconNode}</Host>
  );
}

/** Exact Expo compound API, including the tree-shakeable Icon.select helper. */
export const Icon = Object.assign(IconComponent, {
  select: ExpoIcon.select,
});

export { icons, type AppIconName } from "./icons";
export type { IconName, IconSelectSpec } from "@expo/ui";
