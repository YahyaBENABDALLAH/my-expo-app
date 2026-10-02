import { useTheme } from "@/context/theme.context";
import ExpoMenuView, {
  type MenuComponentProps,
  type MenuComponentRef,
} from "@expo/ui/community/menu";
import type { Ref } from "react";

type MenuViewProps = MenuComponentProps & {
  ref?: Ref<MenuComponentRef>;
};

/**
 * Expo's drop-in MenuView synchronized with the active app color scheme.
 * Its props and imperative ref remain exactly Expo's Menu API.
 */
export function MenuView({ colorScheme, ...props }: MenuViewProps) {
  const { colorScheme: themeColorScheme } = useTheme();

  return (
    <ExpoMenuView
      {...props}
      colorScheme={colorScheme ?? themeColorScheme}
    />
  );
}
