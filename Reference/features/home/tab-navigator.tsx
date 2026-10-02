import { FloatingCenterTabButton } from "@/components/floating-center-tab-button";
import { Icon, icons } from "@/components/Universal/icon";
import { TAB_BAR_HEIGHT } from "@/constants/app.constant";
import {
  CREATION_STATE,
  useCreateRecipeContext,
} from "@/context/create-recipe.context";
import { useTheme } from "@/context/theme.context";
import { Tabs, usePathname, useRouter } from "expo-router";
import { useRef } from "react";
import { View } from "react-native";

export function TabNavigator() {
  const { colors, isDark } = useTheme();
  const tabBarBackgroundColor = colors.tabBarBackground;
  const lastPressTime = useRef(0);

  const router = useRouter();
  const pathname = usePathname();
  const isCurrentlyOnSearchTab =
    pathname === "/search" || pathname.startsWith("/recipe/");
  const isCurrentlyOnMoreTab = pathname === "/more";
  const isCurrentlyOnRecipesTab =
    pathname === "/recipes" || pathname.startsWith("/my-recipes/");

  const {
    creationState,
    setCreationState,
    onSubmitRef,
    onTriggerRef,
    onOpenSearchFiltersRef,
    onOpenProfileRef,
  } = useCreateRecipeContext();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        animation: "none",
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarHideOnKeyboard: true,
        sceneStyle: {
          backgroundColor: "transparent",
        },
        tabBarStyle: {
          position: "absolute",
          bottom: 0,
          height: TAB_BAR_HEIGHT,
          paddingTop: 10,
          paddingBottom: 10,
          paddingHorizontal: 8,
          borderTopWidth: 0,
          borderRadius: 16,
          backgroundColor: "transparent",
          elevation: 0,
        },
        tabBarBackground: () => (
          <View
            style={{
              flex: 1,
              borderRadius: 16,
              backgroundColor: tabBarBackgroundColor,
              shadowColor: isDark ? "#808080" : "#133B3D",
              shadowOpacity: isDark ? 0.42 : 0.18,
              shadowRadius: 24,
              shadowOffset: { width: 0, height: -4 },
              elevation: 18,
            }}
          />
        ),
        tabBarLabelStyle: { fontSize: 12, fontWeight: "600" as const },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <Icon
              name={icons.home}
              size={22}
              color={focused ? colors.primary : colors.mutedForeground}
            />
          ),
          tabBarLabel: "Home",
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ focused }) => (
            <Icon
              name={icons.search}
              size={21}
              color={focused ? colors.primary : colors.mutedForeground}
            />
          ),
          tabBarLabel: "Search",
        }}
      />
      <Tabs.Screen
        name="main"
        options={{
          title: "main",
          tabBarButton: FloatingCenterTabButton,
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            const now = Date.now();
            if (now - lastPressTime.current < 800) {
              return;
            }
            lastPressTime.current = now;

            if (isCurrentlyOnSearchTab) {
              onOpenSearchFiltersRef.current?.();
            } else if (isCurrentlyOnMoreTab) {
              onOpenProfileRef.current?.();
            } else if (isCurrentlyOnRecipesTab) {
              router.push("/my-recipes/liked-favorites");
            } else if (creationState === CREATION_STATE.VALID) {
              onSubmitRef.current?.();
            } else if (creationState === CREATION_STATE.CREATING) {
              onTriggerRef.current?.();
            } else if (creationState === CREATION_STATE.IDLE) {
              setCreationState(CREATION_STATE.CREATING);
              router.push("/create-recipe");
            }
          },
        }}
      />
      <Tabs.Screen
        name="create-recipe"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="recipes"
        options={{
          title: "Mes recettes",
          tabBarIcon: ({ focused }) => (
            <Icon
              name={icons.bookOpen}
              size={21}
              color={focused ? colors.primary : colors.mutedForeground}
            />
          ),
          tabBarLabel: "Recipes",
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: "More",
          tabBarIcon: ({ focused }) => (
            <Icon
              name={icons.menu}
              size={21}
              color={focused ? colors.primary : colors.mutedForeground}
            />
          ),
          tabBarLabel: "More",
        }}
      />
    </Tabs>
  );
}
