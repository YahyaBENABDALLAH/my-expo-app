import {
  getFloatingButtonPalette,
  getPrimaryHueSaturation,
} from "@/components/floating-center-tab-button.theme";
import { Icon, icons } from "@/components/Universal/icon";
import { BUTTON_SIZE } from "@/constants/app.constant";
import {
  CREATION_STATE,
  useCreateRecipeContext,
} from "@/context/create-recipe.context";
import { useTheme } from "@/context/theme.context";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { usePathname } from "expo-router";
import type { BottomTabBarButtonProps } from "expo-router/js-tabs";
import { PlatformPressable } from "expo-router/react-navigation";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { useReducedMotion } from "react-native-reanimated";

export function FloatingCenterTabButton(props: BottomTabBarButtonProps) {
  const { colors, isDark } = useTheme();
  const { creationState, isSearchFilterActive } = useCreateRecipeContext();
  const pathname = usePathname();
  const [pressed, setPressed] = useState(false);
  const reducedMotion = useReducedMotion();
  const isSearch = pathname === "/search" || pathname.startsWith("/recipe/");
  const isMore = pathname === "/more";
  const isRecipes =
    pathname === "/recipes" || pathname.startsWith("/my-recipes/");
  const isValid = creationState === CREATION_STATE.VALID;
  const isCreating = creationState === CREATION_STATE.CREATING;
  const palette = getFloatingButtonPalette({
    hue: getPrimaryHueSaturation(colors.primary),
    isDark,
    isActive: !isSearch && !isMore && !isRecipes && (isCreating || isValid),
    isFilterActive: isSearch && isSearchFilterActive,
    isSearch,
    isMore,
    isRecipes,
  });
  const icon = isSearch
    ? icons.sliders
    : isMore
      ? icons.chef
      : isRecipes
        ? icons.heartFilled
        : isValid
          ? icons.check
          : isCreating
            ? icons.plus
            : icons.utensils;
  const label = isSearch
    ? isSearchFilterActive
      ? "Open active search filters"
      : "Open search filters"
    : isMore
      ? "Open profile preferences"
      : isRecipes
        ? "Open liked recipes and favorites"
        : isValid
          ? "Submit recipe"
          : isCreating
            ? "Continue recipe creation"
            : "Create recipe";

  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Animated.View
        style={{
          top: -24,
          width: BUTTON_SIZE,
          height: BUTTON_SIZE,
          transform: [{ scale: pressed && !reducedMotion ? 0.97 : 1 }],
          opacity: pressed ? 0.85 : 1,
          transitionProperty: ["transform", "opacity"],
          transitionDuration: reducedMotion ? 0 : 100,
        }}
      >
        <LinearGradient
          colors={[palette.wave2[0], palette.wave2[1]]}
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, { borderRadius: BUTTON_SIZE / 2 }]}
        />
        <PlatformPressable
          {...props}
          accessibilityLabel={label}
          accessibilityRole="button"
          hitSlop={8}
          style={{
            width: BUTTON_SIZE,
            height: BUTTON_SIZE,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPressIn={(event) => {
            setPressed(true);
            if (process.env.EXPO_OS === "ios")
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(
                () => {},
              );
            props.onPressIn?.(event);
          }}
          onPressOut={(event) => {
            setPressed(false);
            props.onPressOut?.(event);
          }}
        >
          <View
            pointerEvents="none"
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          >
            <Icon name={icon} size={28} color={colors.primaryForeground} />
          </View>
        </PlatformPressable>
      </Animated.View>
    </View>
  );
}
