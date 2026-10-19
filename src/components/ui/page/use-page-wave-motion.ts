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

export const PAGE_WAVE_HEIGHT = 200;
const WAVE_WIDTH = 1000;
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
    const frontSvg = `M -500 ${-height} H 1500 V 78.75 C 1250 51 1120 110 820 85 S 330 56 80 76.25 S -240 113.75 -500 78.75 Z`;
    const backSvg = `M -500 ${-height} H 1500 V 66.25 C 1000 98.75 1060 55 780 72.5 S 300 107.5 20 83.75 S -260 51 -500 67.5 Z`;
    return {
      frontSvg,
      backSvg,
      frontWave: Skia.Path.MakeFromSVGString(frontSvg)!,
      backWave: Skia.Path.MakeFromSVGString(backSvg)!,
    };
  }, [height]);
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
    { translateY: offset.get() },
  ]);
  const gradientStart = useDerivedValue(() => vec(0, -offset.get()));
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
    ],
  );
}
