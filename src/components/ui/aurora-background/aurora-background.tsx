import { Canvas, Fill, Shader, Skia, useClock } from '@shopify/react-native-skia';
import { StyleProp, ViewStyle, useWindowDimensions } from 'react-native';
import {
  SharedValue,
  useDerivedValue,
  useReducedMotion,
  useSharedValue,
} from 'react-native-reanimated';
import { themes, themeIds } from '@/constants/themes/index';
import { useAppTheme } from '@/hooks/use-theme';
import { useHostColorScheme } from '../host/universal-host';

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
}: {
  hue?: SharedValue<number>;
  colorScheme?: 'light' | 'dark';
  style: StyleProp<ViewStyle>;
}) {
  const scheme = useHostColorScheme(colorScheme);
  const { themeId } = useAppTheme(scheme);
  const palette = shaderPalettes[`${themeId}-${scheme}`];
  const { width, height } = useWindowDimensions();
  const clock = useClock();
  const reduceMotion = useReducedMotion();
  const defaultHue = useSharedValue(0);
  const activeHue = hue ?? defaultHue;

  const uniforms = useDerivedValue(() => ({
    ...palette,
    resolution: [width, height],
    time: reduceMotion ? 0 : clock.get() / 1000,
    hue: activeHue.get(),
  }));

  return (
    <Canvas style={style}>
      <Fill>
        <Shader source={shader} uniforms={uniforms} />
      </Fill>
    </Canvas>
  );
}
