import { WithinHostContext } from "@/components/Universal/host-context";
import { useTheme } from "@/context/theme.context";
import { Host as ExpoHost } from "@expo/ui";
import type { ComponentProps } from "react";
import { I18nManager } from "react-native";

export type HostProps = ComponentProps<typeof ExpoHost>;

/**
 * The single React Native → Expo UI boundary used by the application.
 *
 * It preserves Expo's exact Host API while providing application theme and
 * layout-direction defaults. Explicit Expo props always take precedence.
 */
export function Host({
  children,
  colorScheme,
  layoutDirection,
  seedColor,
  ...props
}: HostProps) {
  const { colorScheme: themeColorScheme, tokens } = useTheme();

  return (
    <ExpoHost
      {...props}
      colorScheme={colorScheme ?? themeColorScheme}
      layoutDirection={
        layoutDirection ??
        (I18nManager.isRTL ? "rightToLeft" : "leftToRight")
      }
      seedColor={seedColor ?? tokens.colors.primary}
    >
      <WithinHostContext value>{children}</WithinHostContext>
    </ExpoHost>
  );
}
