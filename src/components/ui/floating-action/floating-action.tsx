import { useThemeColors } from '@/hooks/use-theme';
import {
  Canvas,
  Circle,
  Group,
  LinearGradient,
  Path,
  RadialGradient,
  Skia,
  vec,
} from '@shopify/react-native-skia';
import * as Haptics from 'expo-haptics';
import { useCallback, useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useDerivedValue,
  useFrameCallback,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnUI } from 'react-native-worklets';
import { navigationActionColors } from '@/constants/colors';
import { getFloatingButtonPalette } from '@/constants/navigation-action-theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useMotionEnabled } from '@/hooks/use-motion-enabled';
import { FloatingActionButton } from './floating-action-button';
import { FloatingActionLayout } from './floating-action-layout';
import type { FloatingActionButtonProps } from './floating-action-button.types';
import { UniversalHost } from '../host/universal-host';

const circle = Skia.Path.Circle(38, 38, 38);
const waveLength = (2 * Math.PI) / 0.08;
// Build one smooth, periodic path at module load. Both liquid layers translate
// this artwork on the UI thread without allocating paths on every frame.
const waveBuilder = Skia.PathBuilder.Make();
waveBuilder.moveTo(-waveLength, 44);
const segmentWidth = waveLength / 4;
for (let segment = 0; segment < 12; segment++) {
  const start = -waveLength + segment * segmentWidth;
  const end = start + segmentWidth;
  waveBuilder.cubicTo(
    start + segmentWidth / 3,
    44 + Math.sin(start * 0.08) * 7 + (Math.cos(start * 0.08) * 0.08 * 7 * segmentWidth) / 3,
    end - segmentWidth / 3,
    44 + Math.sin(end * 0.08) * 7 - (Math.cos(end * 0.08) * 0.08 * 7 * segmentWidth) / 3,
    end,
    44 + Math.sin(end * 0.08) * 7,
  );
}
// Extend below the clip so amplitude changes never uncover the circle's base.
waveBuilder.lineTo(2 * waveLength, 120);
waveBuilder.lineTo(-waveLength, 120);
waveBuilder.close();
const wave = waveBuilder.build();
const gradientStart = vec(0, 0);
const gradientEnd = vec(0, 76);

export function FloatingAction(props: FloatingActionButtonProps & { animate?: boolean }) {
  const phase = useSharedValue(0);
  const breathPhase = useSharedValue(0);
  const tapScale = useSharedValue(1);
  const agitation = useSharedValue(0);
  const enabled = useMotionEnabled(props.animate !== false && !props.disabled);
  const { setActive } = useFrameCallback(({ timeSincePreviousFrame }) => {
    const elapsed = Math.min(timeSincePreviousFrame ?? 0, 64);
    const advance = (elapsed * waveLength) / 4000;
    breathPhase.set((current) => (current + advance) % waveLength);
    phase.set((current) => (current + advance * (1 + agitation.get() * 1.4)) % waveLength);
  }, false);
  useEffect(() => {
    setActive(enabled);
    if (!enabled) {
      phase.set(0);
      breathPhase.set(0);
      tapScale.set(1);
      agitation.set(0);
    }
    return () => {
      setActive(false);
      cancelAnimation(tapScale);
      cancelAnimation(agitation);
    };
  }, [setActive, enabled, phase, breathPhase, tapScale, agitation]);
  // A four-second inhale/exhale with soft turnarounds, driven by the same
  // UI-thread clock as the wave. Native buttons retain their own press feedback.
  const breath = useDerivedValue(() => (1 - Math.cos(breathPhase.get() * 0.08)) / 2);
  const breathingStyle = useAnimatedStyle(() => ({
    transform: [{ scale: (1 + breath.get() * 0.035) * tapScale.get() }],
  }));
  const waveTransform = useDerivedValue(() => [
    { translateY: 44 + Math.sin(phase.get() * 0.16) * agitation.get() * 2.5 },
    { scaleY: 0.9 + breath.get() * 0.2 + agitation.get() * 0.65 },
    { translateY: -44 },
    { translateX: -phase.get() },
  ]);
  const backWaveTransform = useDerivedValue(() => [
    { translateY: 37 },
    { scaleY: 0.7 + breath.get() * 0.15 + agitation.get() * 0.55 },
    { translateY: -44 },
    { translateX: phase.get() - waveLength / 2 },
  ]);
  const highlightOpacity = useDerivedValue(
    () => 0.24 + breath.get() * 0.08 + agitation.get() * 0.15,
  );
  const lightPosition = useDerivedValue(() => ({
    x: 23 - agitation.get() * 6,
    y: 17 - agitation.get() * 3,
  }));
  const shadeOpacity = useDerivedValue(() => 0.22 + agitation.get() * 0.08);
  const rimOpacity = useDerivedValue(() => 0.3 + agitation.get() * 0.2);
  const playPressFeedback = useCallback(
    (onlyIfIdle = false) => {
      'worklet';
      // Release should continue the response already started at touch-down.
      if (onlyIfIdle && agitation.get() > 0) return;
      cancelAnimation(tapScale);
      cancelAnimation(agitation);
      const easeInOut = Easing.bezier(0.77, 0, 0.175, 1);
      tapScale.set(
        withSequence(
          withTiming(1.055, { duration: 160, easing: easeInOut }),
          withTiming(0.94, { duration: 200, easing: easeInOut }),
          withTiming(1, { duration: 240, easing: easeInOut }),
        ),
      );
      agitation.set(
        withSequence(
          withTiming(1, { duration: 180, easing: easeInOut }),
          withTiming(0, { duration: 820, easing: easeInOut }),
        ),
      );
    },
    [tapScale, agitation],
  );
  const cancelPressFeedback = useCallback(() => {
    'worklet';
    tapScale.set(withTiming(1, { duration: 120 }));
    agitation.set(withTiming(0, { duration: 120 }));
  }, [tapScale, agitation]);
  const scheme = useColorScheme(props.colorScheme);
  const colors = useThemeColors(scheme);
  const palette = getFloatingButtonPalette(scheme, colors);
  return (
    <View style={{ width: 76, height: 76 }}>
      <Animated.View
        collapsable={false}
        onTouchStart={() => {
          if (enabled) scheduleOnUI(playPressFeedback);
        }}
        onTouchCancel={() => {
          if (enabled) scheduleOnUI(cancelPressFeedback);
        }}
        style={[
          {
            width: 76,
            height: 76,
            borderRadius: 38,
            backgroundColor: palette.wave2[0],
            opacity: props.disabled ? 0.5 : 1,
            shadowColor: colors.tabBarShadow,
            shadowOpacity: 0.24,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 4 },
            elevation: 6,
          },
          breathingStyle,
        ]}
      >
        <UniversalHost
          colorScheme={scheme}
          matchContents={false}
          ignoreSafeArea="all"
          style={{ width: 76, height: 76 }}
        >
          <FloatingActionLayout
            artwork={
              <View
                pointerEvents="none"
                accessibilityElementsHidden
                importantForAccessibility="no-hide-descendants"
                style={{ width: 76, height: 76 }}
              >
                <Canvas style={{ flex: 1 }}>
                  <Circle cx={38} cy={38} r={38}>
                    <LinearGradient
                      start={gradientStart}
                      end={gradientEnd}
                      colors={palette.wave2}
                    />
                  </Circle>
                  <Group clip={circle}>
                    <Group transform={backWaveTransform}>
                      <Path path={wave} opacity={0.5}>
                        <LinearGradient
                          start={gradientStart}
                          end={gradientEnd}
                          colors={palette.wave1}
                        />
                      </Path>
                    </Group>
                    <Group transform={waveTransform}>
                      <Path path={wave} opacity={0.85}>
                        <LinearGradient
                          start={gradientStart}
                          end={gradientEnd}
                          colors={palette.wave2}
                        />
                      </Path>
                      <Path
                        path={wave}
                        color={colors.onPrimary}
                        style="stroke"
                        strokeWidth={1}
                        opacity={0.24}
                      />
                    </Group>
                    <Circle cx={38} cy={38} r={38} opacity={highlightOpacity}>
                      <RadialGradient
                        c={lightPosition}
                        r={58}
                        colors={[...navigationActionColors.depthHighlight]}
                      />
                    </Circle>
                    <Circle cx={38} cy={38} r={38} opacity={shadeOpacity}>
                      <LinearGradient
                        start={gradientStart}
                        end={gradientEnd}
                        positions={[0.45, 1]}
                        colors={[...navigationActionColors.depthShade]}
                      />
                    </Circle>
                  </Group>
                  <Circle
                    cx={38}
                    cy={38}
                    r={37.25}
                    style="stroke"
                    strokeWidth={1.5}
                    opacity={rimOpacity}
                  >
                    <LinearGradient
                      start={gradientStart}
                      end={gradientEnd}
                      positions={[0, 0.55, 1]}
                      colors={[...navigationActionColors.depthRim]}
                    />
                  </Circle>
                </Canvas>
              </View>
            }
          >
            <FloatingActionButton
              {...props}
              onPress={() => {
                if (props.disabled) return;
                if (enabled) {
                  // Native accessibility/keyboard activation has no touch-down.
                  // Start its response only if touch feedback is not already running.
                  scheduleOnUI(playPressFeedback, true);
                }
                if (process.env.EXPO_OS === 'android') {
                  void Haptics.performAndroidHapticsAsync(
                    Haptics.AndroidHaptics.Context_Click,
                  ).catch(() => {});
                } else {
                  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
                }
                props.onPress();
              }}
            />
          </FloatingActionLayout>
        </UniversalHost>
      </Animated.View>
    </View>
  );
}
