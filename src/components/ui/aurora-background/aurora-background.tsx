import { Canvas, Fill, Shader, Skia } from '@shopify/react-native-skia';
import { useCallback, useEffect, useRef } from 'react';
import {
  Platform,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import {
  type SharedValue,
  useDerivedValue,
  useFrameCallback,
  useSharedValue,
} from 'react-native-reanimated';
import { themes, themeIds } from '@/constants/themes/index';
import { useAppTheme } from '@/hooks/use-theme';
import { useMotionEnabled } from '@/hooks/use-motion-enabled';
import { useHostColorScheme } from '../host/universal-host';

// This slow-moving full-screen shader needs fewer redraws than interactive motion.
const FRAME_INTERVAL_MS = Platform.OS === 'android' ? 1000 / 30 : 0;

// Resolve color uniforms once; animated frames only update time and hue.
const shaderPalettes = Object.fromEntries(
  themeIds.flatMap((themeId) =>
    Object.entries(themes[themeId].colors).map(([scheme, colors]) => [
      `${themeId}-${scheme}`,
      {
        baseColor: Array.from(Skia.Color(colors.background)).slice(0, 3),
        surfaceColor: Array.from(Skia.Color(colors.surfaceRaised)).slice(0, 3),
        primaryColor: Array.from(Skia.Color(colors.primary)).slice(0, 3),
        secondaryColor: Array.from(Skia.Color(colors.secondary)).slice(0, 3),
        intensity: scheme === 'dark' ? 0.28 : 0.1,
      },
    ]),
  ),
);

const shader = Skia.RuntimeEffect.Make(`
uniform vec2 resolution;
uniform float time;
uniform float hue;
uniform vec3 baseColor;
uniform vec3 surfaceColor;
uniform vec3 primaryColor;
uniform vec3 secondaryColor;
uniform float intensity;

vec4 main(vec2 fragCoord) {
  vec2 uv = fragCoord / resolution;
  vec2 p = (fragCoord - 0.5 * resolution) / min(resolution.x, resolution.y);
  float t = time;
  float firstWave = 0.19 * sin(p.x * 3.6 - t * 1.1) + 0.06 * sin(p.x * 8.0 + t * 0.7);
  float secondWave = -0.3 + 0.14 * sin(p.x * 4.1 + t * 0.75);
  float firstBand = exp(-pow((p.y - firstWave) * 4.4, 2.0));
  float secondBand = exp(-pow((p.y - secondWave) * 5.5, 2.0));
  vec2 orb = vec2(0.46 * sin(t * 0.75), 0.13 * cos(t * 0.92));
  float glow = exp(-length(p - orb) * 3.2);
  float core = exp(-pow(length(p - orb) * 7.0, 2.0));
  vec3 accent = mix(primaryColor, secondaryColor, 0.5 + 0.5 * sin(hue));
  vec3 color = mix(baseColor, surfaceColor, (1.0 - uv.y) * 0.3);
  color = mix(color, accent, firstBand * intensity);
  color = mix(color, secondaryColor, secondBand * intensity * 0.4);
  color = mix(color, primaryColor, (glow * 0.37 + core * 0.42) * intensity);
  return vec4(color, 1.0);
}
`)!;

if (!shader) {
  throw new Error('Could not create the Skia shader.');
}

export function AuroraBackground({
  hue,
  colorScheme,
  style,
  animate = true,
}: {
  hue?: SharedValue<number>;
  colorScheme?: 'light' | 'dark';
  style: StyleProp<ViewStyle>;
  animate?: boolean;
}) {
  const scheme = useHostColorScheme(colorScheme);
  const { themeId } = useAppTheme(scheme);
  const palette = shaderPalettes[`${themeId}-${scheme}`];
  // Actual container geometry owns resolution; window subscriptions duplicate it.
  const measured = useRef({ width: 1, height: 1 });
  const resolution = useSharedValue([1, 1]);
  const onLayout = useCallback(
    ({ nativeEvent: { layout } }: LayoutChangeEvent) => {
      if (!Number.isFinite(layout.width) || !Number.isFinite(layout.height)) return;
      const width = Math.max(1, layout.width);
      const height = Math.max(1, layout.height);
      if (measured.current.width === width && measured.current.height === height) return;
      measured.current = { width, height };
      resolution.set([width, height]);
    },
    [resolution],
  );
  const clock = useSharedValue(0);
  const lastDrawTimestamp = useSharedValue(0);
  const enabled = useMotionEnabled(animate);
  const { setActive } = useFrameCallback(({ timestamp, timeSincePreviousFrame }) => {
    // The first frame after resuming establishes a fresh origin, excluding paused time.
    if (timeSincePreviousFrame === null) {
      lastDrawTimestamp.set(timestamp);
      return;
    }
    const elapsed = timestamp - lastDrawTimestamp.get();
    if (elapsed < FRAME_INTERVAL_MS - 0.5) return;
    lastDrawTimestamp.set(timestamp);
    clock.set((time) => time + Math.min(elapsed, 64) / 1000);
  }, false);
  useEffect(() => {
    setActive(enabled);
    return () => setActive(false);
  }, [enabled, setActive]);
  const defaultHue = useSharedValue(0);
  const activeHue = hue ?? defaultHue;

  const uniforms = useDerivedValue(() => ({
    ...palette,
    resolution: resolution.get(),
    time: clock.get(),
    hue: activeHue.get(),
  }));

  return (
    <View
      testID="aurora-background"
      pointerEvents="none"
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      collapsable={false}
      onLayout={onLayout}
      style={style}
    >
      <Canvas pointerEvents="none" style={{ flex: 1 }}>
        <Fill>
          <Shader source={shader} uniforms={uniforms} />
        </Fill>
      </Canvas>
    </View>
  );
}
