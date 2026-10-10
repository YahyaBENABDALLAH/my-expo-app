import { useTranslation } from 'react-i18next';
import { useThemeColors } from '@/hooks/use-theme';
import { Canvas, Path } from '@shopify/react-native-skia';
import { Column, RNHostView, Spacer } from '@expo/ui';
import { useEffect } from 'react';
import LottieView from 'lottie-react-native';
import { View, useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { screenInsets } from '@/lib/screen-insets';
import { useColorScheme } from '@/hooks/use-color-scheme';

import bluePepe from '@assets/animations/blue-pepe.lottie';
import { AuroraBackground } from '../aurora-background/aurora-background';
import { UniversalHost } from '../host/universal-host';
import { UniversalTextContent } from '../text/universal-text';
import { nativeFillSize } from '../native/native-fill-width';

const WAVE_HEIGHT = 144;
const EXIT_DURATION_MS = 2000;
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
  const reducedMotion = useReducedMotion();
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
    if (!exiting) return;

    if (reducedMotion) {
      onExitComplete();
      return;
    }

    offsetY.set(
      withTiming(
        -(height + WAVE_HEIGHT),
        { duration: EXIT_DURATION_MS, easing: Easing.bezier(0.77, 0, 0.175, 1) },
        (finished) => {
          if (finished) scheduleOnRN(onExitComplete);
        },
      ),
    );
    return () => cancelAnimation(offsetY);
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
      pointerEvents={exiting ? 'none' : 'auto'}
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
        <AuroraBackground
          colorScheme={scheme}
          style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
        />
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
                source={bluePepeSource}
                autoPlay={!reducedMotion}
                loop={!reducedMotion}
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
      <Canvas style={{ width, height: WAVE_HEIGHT }}>
        <Path path={`M 0 0 H ${width} V 34 Q ${width / 2} 178 0 34 Z`} color={colors.tint} />
        <Path path={`M 0 0 H ${width} V 20 Q ${width / 2} 150 0 20 Z`} color={colors.background} />
      </Canvas>
    </Animated.View>
  );
}
