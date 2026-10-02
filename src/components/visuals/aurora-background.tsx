import { Canvas, Fill, Shader, Skia, useClock } from '@shopify/react-native-skia';
import { StyleProp, ViewStyle, useWindowDimensions } from 'react-native';
import {
  SharedValue,
  useDerivedValue,
  useReducedMotion,
  useSharedValue,
} from 'react-native-reanimated';

const shader = Skia.RuntimeEffect.Make(`
uniform vec2 resolution;
uniform float time;
uniform float hue;

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
  vec3 deep = vec3(0.02, 0.07, 0.15);
  vec3 teal = vec3(0.08, 0.8, 0.68);
  vec3 violet = vec3(0.53, 0.28, 0.95);
  vec3 accent = mix(teal, violet, 0.5 + 0.5 * sin(hue));
  vec3 color = deep + accent * firstBand * 0.65 + violet * secondBand * 0.26;
  color += accent * glow * 0.37 + vec3(0.48, 0.82, 1.0) * core * 0.42;
  color += vec3(0.06, 0.13, 0.24) * (1.0 - uv.y);
  return vec4(color, 1.0);
}
`)!;

if (!shader) {
  throw new Error('Could not create the Skia shader.');
}

export function AuroraBackground({
  hue,
  style,
}: {
  hue?: SharedValue<number>;
  style: StyleProp<ViewStyle>;
}) {
  const { width, height } = useWindowDimensions();
  const clock = useClock();
  const reduceMotion = useReducedMotion();
  const defaultHue = useSharedValue(0);
  const activeHue = hue ?? defaultHue;

  const uniforms = useDerivedValue(() => ({
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
