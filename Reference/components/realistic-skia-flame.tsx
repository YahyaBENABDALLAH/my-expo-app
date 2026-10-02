import {
  Group,
  LinearGradient,
  Path,
  Skia,
  vec,
} from "@shopify/react-native-skia";
import { useEffect } from "react";
import {
  cancelAnimation,
  Easing,
  SharedValue,
  useDerivedValue,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

// ── Props Interface ───────────────────────────────────────────
interface RealisticSkiaFlameProps {
  cx: number; // Center X of the host button
  cy: number; // Center Y of the host button
  scale?: SharedValue<number>; // Animated scale value for press flare-up (default: 1.0)
  sizeScale?: number; // Static scale factor for resizing the flame (default: 1.0)
  animate?: boolean;
}

// ── Component ─────────────────────────────────────────────────
export function RealisticSkiaFlame({
  cx,
  cy,
  scale,
  sizeScale = 1.0,
  animate = true,
}: RealisticSkiaFlameProps) {
  const reduceMotion = useReducedMotion();
  // 1. Animated scale fallback
  const resolvedScale = useDerivedValue(() => {
    const parentScale = scale ? scale.value : 1.0;
    return parentScale * sizeScale;
  });

  // 3. Flame flicker time state
  const flameFlicker = useSharedValue(0);

  useEffect(() => {
    cancelAnimation(flameFlicker);

    if (!animate || reduceMotion) {
      flameFlicker.value = 0;
      return;
    }

    flameFlicker.value = withRepeat(
      withTiming(2 * Math.PI, {
        duration: 1000,
        easing: Easing.linear,
      }),
      -1,
      false,
    );

    return () => cancelAnimation(flameFlicker);
  }, [animate, flameFlicker, reduceMotion]);

  // 4. Color Palettes for the volumetric glow layers (vibrant gradients)
  const flameOuterColors = ["#FF3D00", "#FF9100"]; // Deep orange-red to bright orange
  const flameInnerColors = ["#FFAB00", "#FFD600"]; // Amber to golden yellow
  const flameCoreColors = ["#FFFF8D", "#FFFFFF"]; // Light yellow to pure white

  // ── Center Tongue Paths (Extra large, realistic main flame) ──
  const centerOuterPath = useDerivedValue(() => {
    const flicker = flameFlicker.value;
    const H = 96 + Math.sin(flicker * 4) * 5; // Massive center height
    const W = 42 + Math.cos(flicker * 3) * 2.5; // Massive center width
    const sway = Math.sin(flicker * 2) * 6;

    const bx = cx;
    const by = cy + 18;
    const tx = cx + sway;
    const ty = cy - H + 18;

    const builder = Skia.PathBuilder.Make();
    if (!builder) return Skia.Path.Circle(0, 0, 0);

    builder.moveTo(bx, by);
    builder.cubicTo(
      bx - W * 0.7,
      by - H * 0.25,
      bx - W * 0.35 + Math.sin(flicker * 5) * 2.5,
      by - H * 0.7,
      tx,
      ty,
    );
    builder.cubicTo(
      bx + W * 0.35 + Math.cos(flicker * 5) * 2.5,
      by - H * 0.7,
      bx + W * 0.7,
      by - H * 0.25,
      bx,
      by,
    );
    builder.close();
    return builder.build();
  });

  const centerInnerPath = useDerivedValue(() => {
    const flicker = flameFlicker.value;
    const H = 68 + Math.sin(flicker * 4.5) * 4;
    const W = 26 + Math.cos(flicker * 3.5) * 1.8;
    const sway = Math.sin(flicker * 2.2) * 4.5;

    const bx = cx;
    const by = cy + 14;
    const tx = cx + sway;
    const ty = cy - H + 14;

    const builder = Skia.PathBuilder.Make();
    if (!builder) return Skia.Path.Circle(0, 0, 0);

    builder.moveTo(bx, by);
    builder.cubicTo(
      bx - W * 0.7,
      by - H * 0.25,
      bx - W * 0.35 + Math.sin(flicker * 5.5) * 1.5,
      by - H * 0.7,
      tx,
      ty,
    );
    builder.cubicTo(
      bx + W * 0.35 + Math.cos(flicker * 5.5) * 1.5,
      by - H * 0.7,
      bx + W * 0.7,
      by - H * 0.25,
      bx,
      by,
    );
    builder.close();
    return builder.build();
  });

  const centerCorePath = useDerivedValue(() => {
    const flicker = flameFlicker.value;
    const H = 40 + Math.sin(flicker * 5) * 2.5;
    const W = 14 + Math.cos(flicker * 4) * 1.0;
    const sway = Math.sin(flicker * 2.5) * 3;

    const bx = cx;
    const by = cy + 10;
    const tx = cx + sway;
    const ty = cy - H + 10;

    const builder = Skia.PathBuilder.Make();
    if (!builder) return Skia.Path.Circle(0, 0, 0);

    builder.moveTo(bx, by);
    builder.cubicTo(
      bx - W * 0.7,
      by - H * 0.25,
      bx - W * 0.35,
      by - H * 0.7,
      tx,
      ty,
    );
    builder.cubicTo(
      bx + W * 0.35,
      by - H * 0.7,
      bx + W * 0.7,
      by - H * 0.25,
      bx,
      by,
    );
    builder.close();
    return builder.build();
  });

  // ── Left Tongue Paths (Large, curves left out-of-phase) ──
  const leftOuterPath = useDerivedValue(() => {
    const flicker = flameFlicker.value;
    const H = 72 + Math.sin(flicker * 3.5) * 4; // Much taller
    const W = 28 + Math.cos(flicker * 2.5) * 2.0; // Much wider
    const sway = -16 + Math.sin(flicker * 1.8) * 4.5;

    const bx = cx - 16;
    const by = cy + 14;
    const tx = cx + sway;
    const ty = cy - H + 14;

    const builder = Skia.PathBuilder.Make();
    if (!builder) return Skia.Path.Circle(0, 0, 0);

    builder.moveTo(bx, by);
    builder.cubicTo(
      bx - W * 0.8,
      by - H * 0.2,
      bx - W * 0.4 + Math.sin(flicker * 4.5) * 2.0,
      by - H * 0.65,
      tx,
      ty,
    );
    builder.cubicTo(
      bx + W * 0.2,
      by - H * 0.65,
      bx + W * 0.5,
      by - H * 0.2,
      bx,
      by,
    );
    builder.close();
    return builder.build();
  });

  const leftInnerPath = useDerivedValue(() => {
    const flicker = flameFlicker.value;
    const H = 50 + Math.sin(flicker * 4) * 2.5;
    const W = 18 + Math.cos(flicker * 3) * 1.2;
    const sway = -12 + Math.sin(flicker * 2.0) * 3.0;

    const bx = cx - 12;
    const by = cy + 10;
    const tx = cx + sway;
    const ty = cy - H + 10;

    const builder = Skia.PathBuilder.Make();
    if (!builder) return Skia.Path.Circle(0, 0, 0);

    builder.moveTo(bx, by);
    builder.cubicTo(
      bx - W * 0.8,
      by - H * 0.2,
      bx - W * 0.4,
      by - H * 0.65,
      tx,
      ty,
    );
    builder.cubicTo(
      bx + W * 0.2,
      by - H * 0.65,
      bx + W * 0.5,
      by - H * 0.2,
      bx,
      by,
    );
    builder.close();
    return builder.build();
  });

  // ── Right Tongue Paths (Large, curves right out-of-phase) ──
  const rightOuterPath = useDerivedValue(() => {
    const flicker = flameFlicker.value;
    const H = 64 + Math.sin(flicker * 3.8) * 4; // Much taller
    const W = 26 + Math.cos(flicker * 2.8) * 2.0; // Much wider
    const sway = 16 + Math.sin(flicker * 1.6) * 4.0;

    const bx = cx + 16;
    const by = cy + 14;
    const tx = cx + sway;
    const ty = cy - H + 14;

    const builder = Skia.PathBuilder.Make();
    if (!builder) return Skia.Path.Circle(0, 0, 0);

    builder.moveTo(bx, by);
    builder.cubicTo(
      bx - W * 0.2,
      by - H * 0.2,
      bx - W * 0.5,
      by - H * 0.65,
      tx,
      ty,
    );
    builder.cubicTo(
      bx + W * 0.4 + Math.cos(flicker * 4.8) * 2.0,
      by - H * 0.65,
      bx + W * 0.8,
      by - H * 0.2,
      bx,
      by,
    );
    builder.close();
    return builder.build();
  });

  const rightInnerPath = useDerivedValue(() => {
    const flicker = flameFlicker.value;
    const H = 44 + Math.sin(flicker * 4.2) * 2.5;
    const W = 16 + Math.cos(flicker * 3.2) * 1.2;
    const sway = 12 + Math.sin(flicker * 1.9) * 2.5;

    const bx = cx + 12;
    const by = cy + 10;
    const tx = cx + sway;
    const ty = cy - H + 10;

    const builder = Skia.PathBuilder.Make();
    if (!builder) return Skia.Path.Circle(0, 0, 0);

    builder.moveTo(bx, by);
    builder.cubicTo(
      bx - W * 0.2,
      by - H * 0.2,
      bx - W * 0.5,
      by - H * 0.65,
      tx,
      ty,
    );
    builder.cubicTo(
      bx + W * 0.4,
      by - H * 0.65,
      bx + W * 0.8,
      by - H * 0.2,
      bx,
      by,
    );
    builder.close();
    return builder.build();
  });

  const flameTransform = useDerivedValue(() => {
    return [
      { scale: resolvedScale.value },
    ];
  });

  return (
    <Group
      transform={flameTransform}
      origin={vec(cx, cy)}
    >
      {/* ── Left Flame Tongue ── */}
      <Path path={leftOuterPath} opacity={0.55}>
        <LinearGradient
          start={vec(cx - 16, cy + 14)}
          end={vec(cx - 16, cy - 54)}
          colors={flameOuterColors}
        />
      </Path>
      <Path path={leftInnerPath} opacity={0.75}>
        <LinearGradient
          start={vec(cx - 12, cy + 10)}
          end={vec(cx - 12, cy - 36)}
          colors={flameInnerColors}
        />
      </Path>

      {/* ── Right Flame Tongue ── */}
      <Path path={rightOuterPath} opacity={0.55}>
        <LinearGradient
          start={vec(cx + 16, cy + 14)}
          end={vec(cx + 16, cy - 46)}
          colors={flameOuterColors}
        />
      </Path>
      <Path path={rightInnerPath} opacity={0.75}>
        <LinearGradient
          start={vec(cx + 12, cy + 10)}
          end={vec(cx + 12, cy - 30)}
          colors={flameInnerColors}
        />
      </Path>

      {/* ── Center Flame Tongue (Hero) ── */}
      <Path path={centerOuterPath} opacity={0.82}>
        <LinearGradient
          start={vec(cx, cy + 18)}
          end={vec(cx, cy - 74)}
          colors={flameOuterColors}
        />
      </Path>
      <Path path={centerInnerPath} opacity={0.92}>
        <LinearGradient
          start={vec(cx, cy + 14)}
          end={vec(cx, cy - 50)}
          colors={flameInnerColors}
        />
      </Path>
      <Path path={centerCorePath}>
        <LinearGradient
          start={vec(cx, cy + 10)}
          end={vec(cx, cy - 28)}
          colors={flameCoreColors}
        />
      </Path>
    </Group>
  );
}
