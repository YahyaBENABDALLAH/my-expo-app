import { DeviceStatusListener } from "@/components/device-status-listener";
import { AlertProvider } from "@/components/ui/alert";
import { AUTH_STATUS } from "@/constants/auth.constant";
import { AuthProvider, useAuthContext } from "@/context/auth.context";
import { CreateRecipeProvider } from "@/context/create-recipe.context";
import {
  LanguageProvider,
  useLanguageContext,
} from "@/context/language.context";
import { AppQueryProvider } from "@/context/query-provider";
import { ThemeProvider, useTheme } from "@/context/theme.context";
import {
  configureNotificationHandling,
  NotificationCoordinator,
} from "@/features/notifications/notification-coordinator";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Observe, ObserveRoot, useObserve } from "expo-observe";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export { AppErrorBoundary as ErrorBoundary } from "@/components/app-error-boundary";

Observe.configure({
  dispatchInDebug: true,
});

configureNotificationHandling();

configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

function AppNavigation() {
  const { isReady } = useLanguageContext();
  const { status } = useAuthContext();
  const { colors } = useTheme();
  const { markInteractive } = useObserve();
  const isAppReady = isReady && status !== AUTH_STATUS.UNKNOWN;

  useEffect(() => {
    if (isAppReady) {
      markInteractive();
    }
  }, [isAppReady, markInteractive]);

  if (!isAppReady) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: "transparent" },
        title: "",
        headerStyle: { backgroundColor: colors.background },
        animation: "flip",
        headerShown: false,
      }}
    >
      <Stack.Screen name="recipe/[uuid]" options={{ headerShown: false }} />
      <Stack.Screen name="category/[uuid]" options={{ headerShown: false }} />
      <Stack.Screen name="health-check/index" options={{ headerShown: false }} />

      <Stack.Screen
        name="my-recipes/liked-favorites"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="my-recipes/history" options={{ headerShown: false }} />
      <Stack.Screen
        name="my-recipes/creations"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="ingredients/index" options={{ headerShown: false }} />
      <Stack.Screen name="become-chef/index" options={{ headerShown: false }} />
      <Stack.Screen name="device-info/index" options={{ headerShown: false }} />
    </Stack>
  );
}

function RootLayout() {
  return (
    <ThemeProvider>
      <AppQueryProvider>
        <AuthProvider>
          <CreateRecipeProvider>
            <LanguageProvider>
              <AlertProvider>
                <RootLayoutContent />
              </AlertProvider>
            </LanguageProvider>
          </CreateRecipeProvider>
        </AuthProvider>
      </AppQueryProvider>
    </ThemeProvider>
  );
}

export default ObserveRoot.wrap(RootLayout);

function RootLayoutContent() {
  const { colors } = useTheme();
  const themeMode = useColorScheme();

  return (
    <>
      <DeviceStatusListener />
      <NotificationCoordinator />
      <SafeAreaView
        style={{ flex: 1, backgroundColor: colors.background }}
      >
        <AppNavigation />
      </SafeAreaView>
      <StatusBar style={themeMode === "dark" ? "light" : "dark"} />
    </>
  );
}
