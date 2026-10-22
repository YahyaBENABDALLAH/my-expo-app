import { useLayoutDirection } from '@/context/layout-direction.context';
import { useMotionEnabled } from '@/hooks/use-motion-enabled';
import { DEFAULT_HEADER_SHAPE } from '@/constants/header-motion';
import { Skia, usePathValue, vec } from '@shopify/react-native-skia';
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
import {
  drawVectorPath,
  headerContour,
  HEADER_MOTION_PERIOD,
  vectorPathToSvg,
  type PageHeaderShape,
} from './page-header-shapes';
import { headerDetails } from './page-header-details';

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
  shape = DEFAULT_HEADER_SHAPE,
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
  const splashPaths = useMemo(
    () =>
      splash
        ? {
            front: Skia.Path.MakeFromSVGString(
              'M0-204c43 28 300-30 423 18s358 8 586 59 351 183 578 38V0H0Z',
            )!,
            back: Skia.Path.MakeFromSVGString(
              'M0-204c43 28 300-30 423 18s374-34 586 59 334-143 630-1V0H0Z',
            )!,
          }
        : null,
    [splash],
  );
  const phase = useSharedValue(0);
  const fillEdge = -height / scaleY;
  const frontContour = useDerivedValue(() => headerContour(shape, phase.get(), 0, fillEdge));
  const backContour = useDerivedValue(() => headerContour(shape, phase.get(), 1, fillEdge));
  const frontWave = usePathValue((builder) => {
    'worklet';
    if (splashPaths) builder.addPath(splashPaths.front);
    else drawVectorPath(builder, frontContour.get());
  });
  const backWave = usePathValue((builder) => {
    'worklet';
    if (splashPaths) builder.addPath(splashPaths.back);
    else drawVectorPath(builder, backContour.get());
  });
  const detailWave = usePathValue((builder) => {
    'worklet';
    if (!splash) drawVectorPath(builder, headerDetails(shape, phase.get()));
  });
  const detailOpacity = useDerivedValue(() => 0.28);
  const frontSvg = useDerivedValue(() => vectorPathToSvg(frontContour.get()));
  const backSvg = useDerivedValue(() => vectorPathToSvg(backContour.get()));
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
      phase.set((value) => (value + elapsed / 1000) % HEADER_MOTION_PERIOD);
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
  // Header paths deform locally. Only the splash retains its original rigid drift.
  const frontDrift = useDerivedValue(() => {
    const movement = Math.sin(((phase.get() * 1000) / WAVE_DURATION_MS) * 2 * Math.PI);
    return [
      { translateX: splash ? movement * 40 * horizontalDirection : 0 },
      { translateY: splash ? movement * 2 : 0 },
      { scaleY: 1 },
      { scaleX: 1 },
    ];
  });
  const backDrift = useDerivedValue(() => {
    const movement = Math.sin(((phase.get() * 1000) / WAVE_DURATION_MS) * 2 * Math.PI);
    return [
      { translateX: splash ? -movement * 50 * horizontalDirection : 0 },
      { translateY: splash ? -movement * 3 : 0 },
      { scaleY: 1 },
      { scaleX: 1 },
    ];
  });

  return useMemo(
    () => ({
      shape,
      detailWave,
      detailOpacity,
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
      shape,
      detailWave,
      detailOpacity,
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
