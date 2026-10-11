import { useThemeColors } from '@/hooks/use-theme';
import { Canvas, Group, LinearGradient, Path, Skia, vec } from '@shopify/react-native-skia';
import { useEffect } from 'react';
import { View } from 'react-native';
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

export const PAGE_WAVE_HEIGHT = 144;
const WAVE_WIDTH = 1000;
// Parse fixed geometry once; animation only changes its transform.
// Oversized paths keep the sides covered throughout the horizontal drift.
const frontWave = Skia.Path.MakeFromSVGString(
  'M -500 -16 H 1500 V 62 C 1250 8 1120 112 820 72 S 330 16 80 58 S -240 118 -500 62 Z',
)!;
const backWave = Skia.Path.MakeFromSVGString(
  'M -500 -16 H 1500 V 46 C 1280 98 1060 20 780 56 S 300 112 20 74 S -260 12 -500 48 Z',
)!;

/** Shared wave artwork for the page header and the splash's moving bottom edge. */
export function PageMotionOverlay({
  animate = true,
  colorScheme,
  variant = 'overlay',
}: {
  animate?: boolean;
  colorScheme?: 'light' | 'dark';
  variant?: 'overlay' | 'splash';
}) {
  const scheme = useColorScheme(colorScheme);
  const colors = useThemeColors(scheme);
  const enabled = useMotionEnabled(animate);
  const splash = variant === 'splash';
  const phase = useSharedValue(0);
  const width = useSharedValue(0);

  useEffect(() => {
    cancelAnimation(phase);
    phase.set(0);
    if (!enabled) return;

    // The live motion guard owns accessibility; Reanimated's startup snapshot can be stale.
    phase.set(
      withRepeat(
        withTiming(2 * Math.PI, {
          duration: 12000,
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

  const fit = useDerivedValue(() => [{ scaleX: width.get() / WAVE_WIDTH }]);
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
          : { position: 'absolute', top: 0, left: 0, right: 0, height: PAGE_WAVE_HEIGHT }
      }
    >
      <Canvas pointerEvents="none" style={{ flex: 1 }}>
        <Group transform={fit}>
          <Group transform={backDrift}>
            <Path path={backWave} opacity={splash ? 1 : scheme === 'dark' ? 0.12 : 0.08}>
              <LinearGradient
                start={vec(0, 0)}
                end={vec(0, PAGE_WAVE_HEIGHT)}
                colors={
                  splash
                    ? [colors.tint, colors.tabIconSelected]
                    : [colors.tabIconSelected, `${colors.tabIconSelected}00`]
                }
              />
            </Path>
          </Group>
          <Group transform={frontDrift}>
            {splash ? <Path path={frontWave} color={colors.background} /> : null}
            <Path path={frontWave} opacity={scheme === 'dark' ? 0.2 : 0.12}>
              <LinearGradient
                start={vec(0, 0)}
                end={vec(0, PAGE_WAVE_HEIGHT)}
                colors={[colors.tint, `${colors.tint}00`]}
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
