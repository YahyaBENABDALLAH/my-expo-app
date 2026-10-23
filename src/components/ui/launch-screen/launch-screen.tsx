import { useTranslation } from 'react-i18next';
import { useThemeColors } from '@/hooks/use-theme';
import { Column, RNHostView, Spacer } from '@expo/ui';
import { useCallback, useEffect, useRef, useState } from 'react';
import LottieView from 'lottie-react-native';
import { Image } from 'expo-image';
import { View, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  ReduceMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { screenInsets } from '@/lib/screen-insets';
import { useColorScheme } from '@/hooks/use-color-scheme';

import { getAppBrand } from '@/config/brand';
import { getBrandHeadingFont, getBrandLaunchArtwork } from '@/config/brand-assets';
import { useLanguage } from '@/context/language.context';
import { useAppActive, useAppReducedMotion, useMotionEnabled } from '@/hooks/use-motion-enabled';
import { UniversalHost } from '../host/universal-host';
import { UniversalTextContent } from '../text/universal-text';
import { nativeFillSize } from '../native/native-fill-width';
import { PageMotionOverlay, PAGE_WAVE_HEIGHT as WAVE_HEIGHT } from '../page/page-motion-overlay';
import { LoadingScreen } from '../loading/loading-state';

type LaunchScreenProps = {
  mode?: 'minimal' | 'branded';
  exiting: boolean;
  onReady?: () => void;
  onExitComplete: () => void;
};

export function LaunchScreen({ mode = 'branded', ...props }: LaunchScreenProps) {
  return mode === 'minimal' ? (
    <MinimalLaunchScreen {...props} />
  ) : (
    <BrandedLaunchScreen {...props} />
  );
}

function MinimalLaunchScreen({ exiting, onReady, onExitComplete }: LaunchScreenProps) {
  const active = useAppActive();
  const [laidOut, setLaidOut] = useState(false);
  useEffect(() => {
    if (exiting && laidOut && active) onExitComplete();
  }, [exiting, laidOut, active, onExitComplete]);
  return (
    <View
      testID="app-launch-minimal"
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      onLayout={() => {
        setLaidOut(true);
        onReady?.();
      }}
    >
      <LoadingScreen />
    </View>
  );
}

function BrandedLaunchScreen({ exiting, onReady, onExitComplete }: LaunchScreenProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const brand = getAppBrand();
  const launchArtwork = getBrandLaunchArtwork(brand);
  const headingFont = getBrandHeadingFont(language, brand);
  const scheme = useColorScheme();
  const colors = useThemeColors(scheme);
  const reducedMotion = useAppReducedMotion();
  const active = useAppActive();
  const animate = useMotionEnabled();
  const artwork = useRef<LottieView>(null);
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const artworkSize = Math.max(
    0,
    Math.min(
      260,
      width - insets.left - insets.right - 48,
      height - insets.top - insets.bottom - 100,
    ),
  );
  const offsetY = useSharedValue(0);
  const remainingHold = useRef(2_000);
  const [holdComplete, setHoldComplete] = useState(false);
  const completed = useRef(false);
  const finish = useCallback(() => {
    if (completed.current) return;
    completed.current = true;
    onExitComplete();
  }, [onExitComplete]);

  useEffect(() => {
    if (animate) artwork.current?.play();
    else artwork.current?.pause();
  }, [animate, launchArtwork.source]);

  useEffect(() => {
    if (!exiting || !active || holdComplete) return;

    // Count foreground time only; the branded hold still applies with Reduce Motion.
    const startedAt = Date.now();
    const hold = setTimeout(() => {
      remainingHold.current = 0;
      setHoldComplete(true);
    }, remainingHold.current);
    return () => {
      clearTimeout(hold);
      remainingHold.current = Math.max(0, remainingHold.current - (Date.now() - startedAt));
    };
  }, [exiting, active, holdComplete]);

  useEffect(() => {
    if (!exiting || !active || !holdComplete) return;
    if (reducedMotion) {
      finish();
      return;
    }
    const distance = height + WAVE_HEIGHT;
    const remaining = Math.max(0, Math.min(1, 1 + offsetY.get() / distance));
    offsetY.set(
      withTiming(
        -distance,
        {
          duration: 2_000 * remaining,
          easing: Easing.bezier(0.77, 0, 0.175, 1),
          reduceMotion: ReduceMotion.Never,
        },
        (finished) => {
          if (finished) scheduleOnRN(finish);
        },
      ),
    );
    return () => cancelAnimation(offsetY);
  }, [exiting, active, holdComplete, height, offsetY, finish, reducedMotion]);

  const exitStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: offsetY.get() }],
  }));

  return (
    <Animated.View
      testID="app-brand-screen"
      onLayout={onReady}
      accessible
      accessibilityLabel={t('launch.loading', { brandName: brand.name })}
      pointerEvents="auto"
      style={[
        {
          position: 'absolute',
          top: 0,
          right: 0,
          left: 0,
          height: height + WAVE_HEIGHT,
        },
        exitStyle,
      ]}
    >
      <View
        style={{
          height,
          ...screenInsets(insets),
          backgroundColor: colors.background,
        }}
      >
        <UniversalHost
          colorScheme={scheme}
          matchContents={false}
          ignoreSafeArea="all"
          style={{ flex: 1 }}
        >
          <Column alignment="center" spacing={16} modifiers={nativeFillSize}>
            <Spacer flexible />
            <RNHostView matchContents>
              {launchArtwork.type === 'lottie' ? (
                <LottieView
                  ref={artwork}
                  // Native Lottie accepts Metro's numeric asset ID; its source type omits it.
                  source={launchArtwork.source as unknown as string}
                  autoPlay={false}
                  loop={animate}
                  style={{ width: artworkSize, height: artworkSize }}
                  testID="app-brand-artwork"
                />
              ) : (
                <Image
                  source={launchArtwork.source}
                  contentFit="contain"
                  style={{ width: artworkSize, height: artworkSize }}
                  testID="app-brand-artwork"
                  accessible={false}
                />
              )}
            </RNHostView>
            <UniversalTextContent
              colorScheme={scheme}
              textStyle={{ fontFamily: headingFont, fontSize: 28, fontWeight: '900' }}
              testID="app-brand-name"
            >
              {brand.name}
            </UniversalTextContent>
            <Spacer flexible />
          </Column>
        </UniversalHost>
      </View>
      <PageMotionOverlay variant="splash" colorScheme={scheme} />
    </Animated.View>
  );
}
