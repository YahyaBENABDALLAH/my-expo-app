import { useThemeColors } from '@/hooks/use-theme';
import { Canvas, Group, LinearGradient, Path, Skia, vec } from '@shopify/react-native-skia';
import { useEffect, useMemo } from 'react';
import { useWindowDimensions, View } from 'react-native';
import {
  cancelAnimation,
  Easing,
  ReduceMotion,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useMotionEnabled } from '@/hooks/use-motion-enabled';
import { scheduleOnRN } from 'react-native-worklets';

export const PAGE_WAVE_HEIGHT = 144;
const WAVE_WIDTH = 1000;

/** Shared wave artwork for the page header and the splash's moving bottom edge. */
export function PageMotionOverlay({
  animate = true,
  colorScheme,
  variant = 'overlay',
  expanded = false,
  onCollapseComplete,
}: {
  animate?: boolean;
  colorScheme?: 'light' | 'dark';
  variant?: 'overlay' | 'splash';
  expanded?: boolean;
  onCollapseComplete?: () => void;
}) {
  const scheme = useColorScheme(colorScheme);
  const colors = useThemeColors(scheme);
  const enabled = useMotionEnabled(animate);
  const splash = variant === 'splash';
  const { height } = useWindowDimensions();
  const expandedOffset = Math.max(0, height * 0.35 - PAGE_WAVE_HEIGHT / 2);
  const target = expanded && !splash ? expandedOffset : 0;
  const [frontWave, backWave] = useMemo(
    () => [
      Skia.Path.MakeFromSVGString(
        `M -500 ${-height} H 1500 V 62 C 1250 8 1120 112 820 72 S 330 16 80 58 S -240 118 -500 62 Z`,
      )!,
      Skia.Path.MakeFromSVGString(
        `M -500 ${-height} H 1500 V 46 C 1280 98 1060 20 780 56 S 300 112 20 74 S -260 12 -500 48 Z`,
      )!,
    ],
    [height],
  );
  const overlayBackOpacity = scheme === 'dark' ? 0.12 : 0.08;
  const overlayColors = [colors.tint, `${colors.tint}CC`];
  const phase = useSharedValue(0);
  const width = useSharedValue(0);
  const offset = useSharedValue(target);

  useEffect(() => {
    if (!enabled) {
      offset.set(target);
      if (!expanded) onCollapseComplete?.();
    } else {
      offset.set(
        withTiming(
          target,
          {
            duration: 1000,
            easing: Easing.inOut(Easing.cubic),
            reduceMotion: ReduceMotion.Never,
          },
          (finished) => {
            if (finished && !expanded && onCollapseComplete) scheduleOnRN(onCollapseComplete);
          },
        ),
      );
    }
    return () => cancelAnimation(offset);
  }, [enabled, expanded, offset, target, onCollapseComplete]);

  useEffect(() => {
    cancelAnimation(phase);
    phase.set(0);
    if (!enabled) return;

    // The live motion guard owns accessibility; Reanimated's startup snapshot can be stale.
    phase.set(
      withRepeat(
        withTiming(2 * Math.PI, {
          duration: 10000,
          easing: Easing.linear,
          reduceMotion: ReduceMotion.Never,
        }),
        -1,
        false,
        undefined,
        ReduceMotion.Never,
      ),
    );
    return () => cancelAnimation(phase);
  }, [enabled, phase]);

  const fit = useDerivedValue(() => [
    { scaleX: width.get() / WAVE_WIDTH },
    { translateY: offset.get() },
  ]);
  const gradientStart = useDerivedValue(() => vec(0, -offset.get()));
  const frontDrift = useDerivedValue(() => [
    { translateX: Math.sin(phase.get()) * 80 },
    { translateY: Math.sin(phase.get()) * 4 },
  ]);
  const backDrift = useDerivedValue(() => [
    { translateX: -Math.sin(phase.get()) * 100 },
    { translateY: -Math.sin(phase.get()) * 6 },
  ]);

  return (
    <View
      testID={splash ? 'launch-wave-edge' : 'page-motion-overlay'}
      pointerEvents="none"
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      collapsable={false}
      onLayout={({ nativeEvent }) => width.set(nativeEvent.layout.width)}
      style={
        splash
          ? { height: PAGE_WAVE_HEIGHT }
          : {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: PAGE_WAVE_HEIGHT + expandedOffset,
            }
      }
    >
      <Canvas pointerEvents="none" style={{ flex: 1 }}>
        <Group transform={fit}>
          <Group transform={backDrift}>
            <Path path={backWave} opacity={splash ? 1 : overlayBackOpacity}>
              <LinearGradient
                start={gradientStart}
                end={vec(0, PAGE_WAVE_HEIGHT)}
                colors={splash ? [colors.tint, colors.tabIconSelected] : overlayColors}
              />
            </Path>
          </Group>
          <Group transform={frontDrift}>
            {splash ? <Path path={frontWave} color={colors.background} /> : null}
            <Path path={frontWave} opacity={scheme === 'dark' ? 0.2 : 0.12}>
              <LinearGradient
                start={gradientStart}
                end={vec(0, PAGE_WAVE_HEIGHT)}
                colors={splash ? [colors.tint, `${colors.tint}00`] : overlayColors}
              />
            </Path>
            <Path
              path={frontWave}
              color={colors.tint}
              opacity={scheme === 'dark' ? 0.22 : 0.12}
              style="stroke"
              strokeWidth={2}
            />
          </Group>
        </Group>
      </Canvas>
    </View>
  );
}
