import { useTranslation } from 'react-i18next';
import { useThemeColors } from '@/hooks/use-theme';
import { Column, RNHostView, Spacer } from '@expo/ui';
import { useEffect, useRef } from 'react';
import LottieView from 'lottie-react-native';
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

import bluePepe from '@assets/animations/blue-pepe.lottie';
import { useAppReducedMotion, useMotionEnabled } from '@/hooks/use-motion-enabled';
import { UniversalHost } from '../host/universal-host';
import { UniversalTextContent } from '../text/universal-text';
import { nativeFillSize } from '../native/native-fill-width';
import { PageMotionOverlay, PAGE_WAVE_HEIGHT as WAVE_HEIGHT } from '../page/page-motion-overlay';

// LottieView accepts Metro's numeric asset ID on native, though its source type omits it.
const bluePepeSource = bluePepe as unknown as string;

export function LaunchScreen({
  exiting,
  onReady,
  onExitComplete,
}: {
  exiting: boolean;
  onReady?: () => void;
  onExitComplete: () => void;
}) {
  const { t } = useTranslation();
  const scheme = useColorScheme();
  const colors = useThemeColors(scheme);
  const reducedMotion = useAppReducedMotion();
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

  useEffect(() => {
    if (animate) artwork.current?.play();
    else artwork.current?.pause();
  }, [animate]);

  useEffect(() => {
    if (!exiting) return;

    // The launch hold also applies when artwork is static.
    const hold = setTimeout(() => {
      if (reducedMotion) {
        onExitComplete();
        return;
      }
      offsetY.set(
        withTiming(
          -(height + WAVE_HEIGHT),
          {
            duration: 2_000,
            easing: Easing.bezier(0.77, 0, 0.175, 1),
            reduceMotion: ReduceMotion.Never,
          },
          (finished) => {
            if (finished) scheduleOnRN(onExitComplete);
          },
        ),
      );
    }, 2_000);
    return () => {
      clearTimeout(hold);
      cancelAnimation(offsetY);
    };
  }, [exiting, height, offsetY, onExitComplete, reducedMotion]);

  const exitStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: offsetY.get() }],
  }));

  return (
    <Animated.View
      testID="app-brand-screen"
      onLayout={onReady}
      accessible
      accessibilityLabel={t('launch.loading')}
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
              <LottieView
                ref={artwork}
                source={bluePepeSource}
                autoPlay={false}
                loop={animate}
                style={{ width: artworkSize, height: artworkSize }}
              />
            </RNHostView>
            <UniversalTextContent
              colorScheme={scheme}
              textStyle={{ fontFamily: 'Inter-Black', fontSize: 28 }}
            >
              {t('brand.name')}
            </UniversalTextContent>
            <Spacer flexible />
          </Column>
        </UniversalHost>
      </View>
      <PageMotionOverlay variant="splash" colorScheme={scheme} />
    </Animated.View>
  );
}
