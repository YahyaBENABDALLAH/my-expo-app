import { useLayoutDirection } from '@/context/layout-direction.context';
import { useMotionEnabled } from '@/hooks/use-motion-enabled';
import { Skia, vec } from '@shopify/react-native-skia';
import { useCallback, useEffect, useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import {
  cancelAnimation,
  Easing,
  type FrameInfo,
  ReduceMotion,
  useDerivedValue,
  useFrameCallback,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

export const PAGE_WAVE_HEIGHT = 80;
// Crop 50 design units from each side of the shorter path for horizontal drift.
const WAVE_WIDTH = 1587 - 100;
const WAVE_SCALE_Y = PAGE_WAVE_HEIGHT / 210;
const WAVE_DURATION_MS = 8000;

/** One motion source keeps the visible artwork and native blur mask aligned. */
export function usePageWaveMotion({
  animate,
  expanded,
  splash,
  onCollapseComplete,
}: {
  animate: boolean;
  expanded: boolean;
  splash: boolean;
  onCollapseComplete?: () => void;
}) {
  const enabled = useMotionEnabled(animate);
  const direction = useLayoutDirection();
  const horizontalDirection = direction === 'rtl' ? -1 : 1;
  const { height } = useWindowDimensions();
  const expandedOffset = Math.max(0, height * 0.35 - PAGE_WAVE_HEIGHT / 2);
  const target = expanded && !splash ? expandedOffset : 0;
  const { frontWave, backWave, frontSvg, backSvg } = useMemo(() => {
    // After the vertical flip, this closing edge stays above the screen during expansion.
    const fillEdge = splash ? 0 : height / WAVE_SCALE_Y;
    const frontSvg = `M0-204c43 28 300-30 423 18s358 8 586 59 351 183 578 38V${fillEdge}H0Z`;
    const backSvg = `M0-204c43 28 300-30 423 18s374-34 586 59 334-143 630-1V${fillEdge}H0Z`;
    return {
      frontSvg,
      backSvg,
      frontWave: Skia.Path.MakeFromSVGString(frontSvg)!,
      backWave: Skia.Path.MakeFromSVGString(backSvg)!,
    };
  }, [height, splash]);
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

  const advance = useCallback(
    ({ timeSincePreviousFrame }: FrameInfo) => {
      'worklet';
      // Activation starts with a null delta, so paused time never advances the wave.
      if (timeSincePreviousFrame === null) return;
      const elapsed = Math.min(timeSincePreviousFrame, 64);
      phase.set((value) => (value + (elapsed / WAVE_DURATION_MS) * 2 * Math.PI) % (2 * Math.PI));
    },
    [phase],
  );
  const { setActive } = useFrameCallback(advance, false);
  useEffect(() => {
    setActive(enabled);
    return () => setActive(false);
  }, [enabled, setActive]);

  const fit = useDerivedValue(() => [
    { scaleX: width.get() / WAVE_WIDTH },
    { translateY: offset.get() + (splash ? PAGE_WAVE_HEIGHT : 0) },
    { translateX: -50 },
    { scaleY: splash ? WAVE_SCALE_Y : -WAVE_SCALE_Y },
  ]);
  const gradientStart = useDerivedValue(() =>
    vec(
      0,
      splash ? -(offset.get() + PAGE_WAVE_HEIGHT) / WAVE_SCALE_Y : offset.get() / WAVE_SCALE_Y,
    ),
  );
  const frontDrift = useDerivedValue(() => [
    { translateX: Math.sin(phase.get()) * 40 * horizontalDirection },
    { translateY: Math.sin(phase.get()) * 2 },
  ]);
  const backDrift = useDerivedValue(() => [
    { translateX: -Math.sin(phase.get()) * 50 * horizontalDirection },
    { translateY: -Math.sin(phase.get()) * 3 },
  ]);

  return useMemo(
    () => ({
      frontWave,
      backWave,
      frontSvg,
      backSvg,
      fit,
      gradientStart,
      gradientEnd: vec(0, splash ? 0 : -PAGE_WAVE_HEIGHT / WAVE_SCALE_Y),
      frontDrift,
      backDrift,
      width,
      overlayHeight: PAGE_WAVE_HEIGHT + expandedOffset,
    }),
    [
      frontWave,
      backWave,
      frontSvg,
      backSvg,
      fit,
      gradientStart,
      frontDrift,
      backDrift,
      width,
      expandedOffset,
      splash,
    ],
  );
}
