import {
  AuthText,
  Column,
  ToastHost,
  UniversalHost as Host,
  LaunchScreen,
  LoadingContent,
  nativeFillSize,
  PageFrame,
  PageSection,
  PageMotionOverlay,
  Spacer,
  UniversalButtonContent,
} from '@components/ui';
import { useFonts } from 'expo-font';
import { Stack, ThemeProvider, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Appearance, Platform, View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { navigationTheme } from '@/constants/navigation-theme';
import { stackMotionOptions } from '@/constants/navigation-motion';
import { AuthProvider, useAuthContext } from '@/context/auth.context';
import { LanguageProvider, useLanguage } from '@/context/language.context';
import { LoginTransitionContext } from '@/context/login-transition.context';
import { LayoutDirectionProvider, useLayoutDirection } from '@/context/layout-direction.context';
import { OnboardingProvider, useOnboarding } from '@/context/onboarding.context';
import { AppQueryProvider } from '@/context/query-provider';
import { ThemePreferencesProvider, useThemeSettings } from '@/context/theme.context';
import { useAuthGuards } from '@/guards/auth-guards';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColors } from '@/hooks/use-theme';
import { screenInsets } from '@/lib/screen-insets';

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
SplashScreen.setOptions({ duration: 0, fade: false });

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'Inter-Black': require('@assets/fonts/Inter-Black.otf'),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  if (!loaded) {
    return null;
  }

  return (
    <LayoutDirectionProvider>
      <LanguageProvider>
        <ThemePreferencesProvider>
          <AppQueryProvider>
            <OnboardingProvider>
              <AuthProvider>
                <RootLayoutContent />
              </AuthProvider>
            </OnboardingProvider>
          </AppQueryProvider>
        </ThemePreferencesProvider>
      </LanguageProvider>
    </LayoutDirectionProvider>
  );
}

function RootLayoutContent() {
  const { colorScheme: appearancePreference } = useThemeSettings();
  useEffect(() => {
    Appearance.setColorScheme(
      appearancePreference === 'system' ? 'unspecified' : appearancePreference,
    );
  }, [appearancePreference]);
  const colorScheme = useColorScheme();
  const colors = useThemeColors(colorScheme);
  const [showBrandScreen, setShowBrandScreen] = useState(true);
  const { restoring, requireAuth } = useAuthGuards();
  const pathname = usePathname();
  const expanded = pathname === '/login' && !requireAuth;
  const [loginWaveComplete, setLoginWaveComplete] = useState(true);
  if (expanded && !showBrandScreen && loginWaveComplete) setLoginWaveComplete(false);
  const holdLogin = !showBrandScreen && pathname === '/login' && requireAuth && !loginWaveComplete;
  const finishLoginWave = useCallback(() => setLoginWaveComplete(true), []);
  const { error } = useAuthContext();
  const { ready: languageReady } = useLanguage();
  const { ready: onboardingReady, completed: onboardingCompleted } = useOnboarding();
  const animatePageArtwork = !showBrandScreen;
  // Restoration failures must expose their retry UI instead of keeping the launch overlay.
  const ready = languageReady && onboardingReady && (!restoring || Boolean(error));
  const finishBrandScreen = useCallback(() => setShowBrandScreen(false), []);
  const revealBrandScreen = useCallback(() => {
    SplashScreen.hide();
  }, []);

  return (
    <LoginTransitionContext.Provider value={holdLogin}>
      <View
        testID={ready && !showBrandScreen ? 'app-ready' : undefined}
        collapsable={false}
        style={{ flex: 1, backgroundColor: colors.background }}
      >
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <PageMotionOverlay
          visible={onboardingCompleted}
          animate={animatePageArtwork}
          expanded={expanded}
          onCollapseComplete={finishLoginWave}
        >
          {ready || !showBrandScreen ? <RootLayoutNav holdLogin={holdLogin} /> : null}
        </PageMotionOverlay>
        {showBrandScreen && (
          <LaunchScreen
            exiting={ready}
            onReady={revealBrandScreen}
            onExitComplete={finishBrandScreen}
          />
        )}
        {!showBrandScreen && <ToastHost />}
      </View>
    </LoginTransitionContext.Provider>
  );
}

function RootLayoutNav({ holdLogin }: { holdLogin: boolean }) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const colors = useThemeColors(colorScheme);
  const direction = useLayoutDirection();
  const reducedMotion = useReducedMotion();
  const { requireAuth, requireNoAuth, restoring } = useAuthGuards();
  const { error, retryRestore } = useAuthContext();
  const { completed } = useOnboarding();

  if (restoring)
    return (
      <PageFrame title={t('session.title')}>
        <View
          style={{
            flex: 1,
            ...screenInsets(insets, { headerShown: true }),
          }}
        >
          <Host
            style={{ flex: 1 }}
            colorScheme={colorScheme}
            seedColor={colors.tint}
            matchContents={false}
            ignoreSafeArea="all"
          >
            <Column spacing={16} alignment="center" modifiers={nativeFillSize}>
              <Spacer flexible />
              <PageSection alignment="center">
                {error ? (
                  <AuthText>{error}</AuthText>
                ) : (
                  <LoadingContent label={t('session.restoring')} />
                )}
                {error ? (
                  <UniversalButtonContent
                    variant="secondary"
                    label={t('common.tryAgain')}
                    onPress={retryRestore}
                  />
                ) : null}
              </PageSection>
              <Spacer flexible />
            </Column>
          </Host>
        </View>
      </PageFrame>
    );

  return (
    <ThemeProvider value={navigationTheme(colorScheme, colors)}>
      <Stack
        screenOptions={{
          ...stackMotionOptions(reducedMotion),
          freezeOnBlur: Platform.OS === 'android',
          contentStyle: { backgroundColor: colors.background, direction },
          headerShown: false,
          headerShadowVisible: false,
        }}
      >
        <Stack.Protected guard={!completed}>
          <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={completed && (requireNoAuth || holdLogin)}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={completed && requireAuth && !holdLogin}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="recipe/[uuid]" options={{ title: t('common.recipeLabel') }} />
          <Stack.Screen name="category/[uuid]" options={{ title: t('common.category') }} />
          <Stack.Screen
            name="my-recipes/liked-favorites"
            options={{ title: t('common.savedRecipes') }}
          />
          <Stack.Screen name="my-recipes/history" options={{ title: t('common.recipeHistory') }} />
          <Stack.Screen name="my-recipes/creations" options={{ title: t('common.creations') }} />
          <Stack.Screen name="ingredients" options={{ title: t('common.ingredients') }} />
          <Stack.Screen name="settings" options={{ title: t('settings.title') }} />
          <Stack.Screen name="become-chef" options={{ title: t('chefProfile.heroTitle') }} />
          <Stack.Screen name="device-info" options={{ title: t('tools.deviceInfo') }} />
          <Stack.Screen name="health-check" options={{ title: t('common.healthCheck') }} />
          <Stack.Screen name="ui" options={{ title: t('tools.showcase') }} />
          <Stack.Screen name="ui-component/[name]" options={{ title: t('tools.component') }} />
          <Stack.Screen name="development-pages" options={{ title: t('tools.allPages') }} />
          <Stack.Screen name="main" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={completed}>
          <Stack.Screen name="sign-up" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack.Protected>
      </Stack>
    </ThemeProvider>
  );
}
