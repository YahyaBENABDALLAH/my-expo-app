import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

import { LaunchScreen } from '@/features/launch/launch-screen';
import Colors from '@/constants/colors';
import { useColorScheme } from '@/hooks/use-color-scheme';

const BRAND_SCREEN_DURATION_MS = 5000;

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync().catch(() => {
  // The splash may already be hidden during a development reload.
});
SplashScreen.setOptions({ duration: 300, fade: true });

export default function RootLayout() {
  const [showBrandScreen, setShowBrandScreen] = useState(true);
  const [brandScreenExiting, setBrandScreenExiting] = useState(false);
  const [loaded, error] = useFonts({
    SpaceMono: require('@assets/fonts/SpaceMono-Regular.ttf'),
    'Inter-Black': require('@assets/fonts/Inter-Black.otf'),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (!loaded) return;

    SplashScreen.hide();
    const timeout = setTimeout(() => {
      setBrandScreenExiting(true);
    }, BRAND_SCREEN_DURATION_MS);

    return () => clearTimeout(timeout);
  }, [loaded]);

  const finishBrandScreen = useCallback(() => {
    setShowBrandScreen(false);
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <View
      testID="app-ready"
      collapsable={false}
      style={{ flex: 1, backgroundColor: Colors.dark.background }}
    >
      <StatusBar style={showBrandScreen ? 'light' : 'auto'} />
      <RootLayoutNav />
      {showBrandScreen && (
        <LaunchScreen exiting={brandScreenExiting} onExitComplete={finishBrandScreen} />
      )}
    </View>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const reducedMotion = useReducedMotion();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          animation: reducedMotion ? 'fade' : 'default',
          animationMatchesGesture: reducedMotion,
          contentStyle: { backgroundColor: Colors[colorScheme].background },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/login" options={{ title: 'Log in', headerTransparent: true }} />
        <Stack.Screen
          name="(auth)/register"
          options={{ title: 'Create account', headerTransparent: true }}
        />
        <Stack.Screen
          name="(auth)/forgot-password"
          options={{ title: 'Reset password', headerTransparent: true }}
        />
      </Stack>
    </ThemeProvider>
  );
}
