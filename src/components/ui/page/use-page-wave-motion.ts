import { Skia, vec } from '@shopify/react-native-skia';
import { useEffect, useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import {
  cancelAnimation,
  Easing,
  ReduceMotion,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { useMotionEnabled } from '@/hooks/use-motion-enabled';

export const PAGE_WAVE_HEIGHT = 144;
const WAVE_WIDTH = 1000;

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

  return useMemo(
    () => ({
      frontWave,
      backWave,
      fit,
      gradientStart,
      frontDrift,
      backDrift,
      width,
      overlayHeight: PAGE_WAVE_HEIGHT + expandedOffset,
    }),
    [frontWave, backWave, fit, gradientStart, frontDrift, backDrift, width, expandedOffset],
  );
}
