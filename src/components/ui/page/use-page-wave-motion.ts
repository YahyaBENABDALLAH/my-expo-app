import { useLayoutDirection } from '@/context/layout-direction.context';
import { useMotionEnabled } from '@/hooks/use-motion-enabled';
import { Skia, vec } from '@shopify/react-native-skia';
import { useCallback, useEffect, useMemo, useState } from 'react';
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
import { HEADER_CURVE_START, headerShapeCurves, type PageHeaderShape } from './page-header-shapes';

export const PAGE_WAVE_HEIGHT = 80;
const HEADER_WAVE_WIDTH = 1000;
const HEADER_WAVE_HEIGHT = 100;
const SPLASH_SCALE_Y = PAGE_WAVE_HEIGHT / 210;
const WAVE_DURATION_MS = 8000;

/** One motion source keeps the visible artwork and native blur mask aligned. */
export function usePageWaveMotion({
  animate,
  expanded,
  splash,
  shape = 'waves',
  onCollapseComplete,
}: {
  animate: boolean;
  expanded: boolean;
  splash: boolean;
  shape?: PageHeaderShape;
  onCollapseComplete?: () => void;
}) {
  const enabled = useMotionEnabled(animate);
  const direction = useLayoutDirection();
  const horizontalDirection = direction === 'rtl' ? -1 : 1;
  const { height } = useWindowDimensions();
  const [headerHeight, setHeaderHeight] = useState(PAGE_WAVE_HEIGHT);
  const [expandedSurface, setExpandedSurface] = useState(expanded);
  if (expanded && !expandedSurface) setExpandedSurface(true);
  if (!enabled && !expanded && expandedSurface) setExpandedSurface(false);
  const waveHeight = splash ? PAGE_WAVE_HEIGHT : headerHeight;
  const scaleY = splash ? SPLASH_SCALE_Y : waveHeight / HEADER_WAVE_HEIGHT;
  const expandedOffset = Math.max(0, height * 0.35 - waveHeight / 2);
  const target = expanded && !splash ? expandedOffset : 0;
  const { frontWave, backWave, frontSvg, backSvg } = useMemo(() => {
    // Each header path has a steady leading section and a variable trailing curve.
    // Closing above the screen keeps expanded Login filled throughout the motion.
    const fillEdge = -height / scaleY;
    const curves = headerShapeCurves[shape];
    const start = `M-100 100H${HEADER_CURVE_START}`;
    const close = `V${fillEdge}H-100Z`;
    const frontSvg = splash
      ? 'M0-204c43 28 300-30 423 18s358 8 586 59 351 183 578 38V0H0Z'
      : `${start}${curves.front}${close}`;
    const backSvg = splash
      ? 'M0-204c43 28 300-30 423 18s374-34 586 59 334-143 630-1V0H0Z'
      : `${start}${curves.back}${close}`;
    return {
      frontSvg,
      backSvg,
      frontWave: Skia.Path.MakeFromSVGString(frontSvg)!,
      backWave: Skia.Path.MakeFromSVGString(backSvg)!,
    };
  }, [height, scaleY, shape, splash]);
  const phase = useSharedValue(0);
  const width = useSharedValue(0);
  const offset = useSharedValue(target);

  const finishCollapse = useCallback(() => {
    setExpandedSurface(false);
    onCollapseComplete?.();
  }, [onCollapseComplete]);

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
            if (finished && !expanded) scheduleOnRN(finishCollapse);
          },
        ),
      );
    }
    return () => cancelAnimation(offset);
  }, [enabled, expanded, offset, target, finishCollapse, onCollapseComplete]);

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
    {
      scaleX:
        (width.get() / (splash ? 1487 : HEADER_WAVE_WIDTH)) * (splash ? 1 : horizontalDirection),
    },
    { translateY: offset.get() + (splash ? PAGE_WAVE_HEIGHT : 0) },
    { translateX: splash ? -50 : direction === 'rtl' ? -HEADER_WAVE_WIDTH : 0 },
    { scaleY },
  ]);
  const gradientStart = useDerivedValue(() =>
    vec(0, splash ? -(offset.get() + PAGE_WAVE_HEIGHT) / scaleY : -offset.get() / scaleY),
  );
  const frontDrift = useDerivedValue(() => {
    const movement = Math.sin(phase.get());
    const depth = splash ? 1 : 0.8 + movement * 0.2;
    const stretch = splash ? 1 : 1 + movement * 0.08;
    return [
      // Scale around the junction so motion cannot enter the leading 40%.
      {
        translateX: splash
          ? movement * 40 * horizontalDirection
          : HEADER_CURVE_START * (1 - stretch),
      },
      { translateY: splash ? movement * 2 : HEADER_WAVE_HEIGHT * (1 - depth) },
      { scaleY: depth },
      { scaleX: stretch },
    ];
  });
  const backDrift = useDerivedValue(() => {
    const movement = Math.sin(phase.get());
    const depth = splash ? 1 : 0.8 - movement * 0.2;
    const stretch = splash ? 1 : 1 - movement * 0.1;
    return [
      {
        translateX: splash
          ? -movement * 50 * horizontalDirection
          : HEADER_CURVE_START * (1 - stretch),
      },
      { translateY: splash ? -movement * 3 : HEADER_WAVE_HEIGHT * (1 - depth) },
      { scaleY: depth },
      { scaleX: stretch },
    ];
  });

  return useMemo(
    () => ({
      frontWave,
      backWave,
      frontSvg,
      backSvg,
      fit,
      gradientStart,
      gradientEnd: vec(0, splash ? 0 : HEADER_WAVE_HEIGHT),
      frontDrift,
      backDrift,
      width,
      waveHeight,
      setHeaderHeight,
      overlayHeight: waveHeight + (!splash && (expanded || expandedSurface) ? expandedOffset : 0),
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
      waveHeight,
      expanded,
      expandedSurface,
      splash,
    ],
  );
}
