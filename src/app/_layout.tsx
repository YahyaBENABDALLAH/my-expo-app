import {
  UniversalTextContent as Text,
  Column,
  AlertHost,
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
import { ReducedMotionConfig, ReduceMotion } from 'react-native-reanimated';
import { useAppReducedMotion } from '@/hooks/use-motion-enabled';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { navigationTheme } from '@/constants/navigation-theme';
import { stackMotionOptions } from '@/constants/navigation-motion';
import { AuthProvider, useAuthContext } from '@/context/auth.context';
import { LanguageProvider, useLanguage } from '@/context/language.context';
import { LoginTransitionContext } from '@/context/login-transition.context';
import { LayoutDirectionProvider, useLayoutDirection } from '@/context/layout-direction.context';
import { AppQueryProvider } from '@/context/query-provider';
import { ThemePreferencesProvider, useThemeSettings } from '@/context/theme.context';
import { useAuthGuards } from '@/guards/auth-guards';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useStoreUpdates } from '@/hooks/use-store-updates';
import { useThemeColors } from '@/hooks/use-theme';
import { screenInsets } from '@/lib/screen-insets';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index',
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
        <ThemePreferencesProvider persistHeaderMotion>
          <AppQueryProvider>
            <AuthProvider>
              <RootLayoutContent />
            </AuthProvider>
          </AppQueryProvider>
        </ThemePreferencesProvider>
      </LanguageProvider>
    </LayoutDirectionProvider>
  );
}

function RootLayoutContent() {
  const {
    colorScheme: appearancePreference,
    headerShape,
    headerMotionReady = true,
  } = useThemeSettings();
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
  const animatePageArtwork = !showBrandScreen;
  const reducedMotion = useAppReducedMotion();
  // Restoration failures must expose their retry UI instead of keeping the launch overlay.
  const ready = languageReady && headerMotionReady && (!restoring || Boolean(error));
  const finishBrandScreen = useCallback(() => setShowBrandScreen(false), []);
  const revealBrandScreen = useCallback(() => {
    SplashScreen.hide();
  }, []);
  useStoreUpdates(!showBrandScreen);

  return (
    <LoginTransitionContext.Provider value={holdLogin}>
      <View
        testID={ready && !showBrandScreen ? 'app-ready' : undefined}
        collapsable={false}
        style={{ flex: 1, backgroundColor: colors.background }}
      >
        <ReducedMotionConfig mode={reducedMotion ? ReduceMotion.Always : ReduceMotion.Never} />
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <PageMotionOverlay
          shape={headerShape}
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
        {!showBrandScreen && <AlertHost />}
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
  const reducedMotion = useAppReducedMotion();
  const { requireAuth, requireNoAuth, restoring } = useAuthGuards();
  const { error, retryRestore } = useAuthContext();

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
                {error ? <Text>{error}</Text> : <LoadingContent label={t('session.restoring')} />}
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
        <Stack.Screen name="index" />
        <Stack.Screen name="ui" />
        <Stack.Screen name="ui-component/[name]" />
        <Stack.Screen name="settings" />
        <Stack.Protected guard={requireNoAuth || holdLogin}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
        <Stack.Protected guard={requireAuth && !holdLogin}>
          <Stack.Screen name="account" />
        </Stack.Protected>
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}
