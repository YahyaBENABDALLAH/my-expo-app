import { IconButton } from "@/components/Universal/button";
import { icons } from "@/components/Universal/icon";
import { space, TOUCH_TARGET_SIZE, Z_INDEX } from "@/constants/theme.tokens";
import { useThemeContext } from "@/context/theme.context";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

export function ThemeToggleButton() {
  const { colorScheme, toggleColorScheme } = useThemeContext();
  const { t } = useTranslation();
  const isDark = colorScheme === "dark";

  return (
    <View style={{ position: "absolute", end: space(4), top: 0, zIndex: Z_INDEX.overlay }}>
      <IconButton
        icon={isDark ? icons.sun : icons.moonStars}
        accessibilityLabel={`${t("common.theme")}: ${t(isDark ? "common.lightMode" : "common.darkMode")}`}
        size="md"
        style={{ width: TOUCH_TARGET_SIZE }}
        onPress={toggleColorScheme}
      />
    </View>
  );
}
