import { useThemeColors } from '@/hooks/use-theme';
import { useMotionEnabled } from '@/hooks/use-motion-enabled';
import { Column } from '@expo/ui';
import { forwardRef, type ComponentProps, type ComponentRef } from 'react';
import { createAnimatedComponent, cubicBezier } from 'react-native-reanimated';
import { skeletonModifiers } from './skeleton-modifiers';
import { UniversalHost, useHostColorScheme } from '../host/universal-host';
import {
  SKELETON_DIMMED_OPACITY,
  SKELETON_PULSE_DURATION_MS,
  useSkeletonPulse,
} from './use-skeleton-pulse';

// Animate the existing RN Host, keeping the painted shape in Expo UI and avoiding
// another view or a React update at every pulse endpoint.
const AnimatedSkeletonHost = createAnimatedComponent(
  forwardRef<ComponentRef<typeof UniversalHost>, ComponentProps<typeof UniversalHost>>(
    function SkeletonHost(props, ref) {
      return <UniversalHost {...props} ref={ref} />;
    },
  ),
);
const pulseStyle = {
  opacity: 1,
  animationName: { from: { opacity: 1 }, to: { opacity: SKELETON_DIMMED_OPACITY } },
  animationDuration: SKELETON_PULSE_DURATION_MS,
  animationIterationCount: 'infinite',
  animationDirection: 'alternate',
  animationTimingFunction: cubicBezier(0.77, 0, 0.175, 1),
} satisfies ComponentProps<typeof AnimatedSkeletonHost>['style'];

export type SkeletonStyle = {
  /** Omit width or use '100%' to fill the owning native container. */
  width?: number | '100%';
  height?: number;
  borderRadius?: number;
  backgroundColor?: string;
  opacity?: number;
};

export type SkeletonProps = {
  /** Pulse by default; disable when the owning screen is unfocused. */
  animate?: boolean;
  style?: SkeletonStyle;
  colorScheme?: 'light' | 'dark';
  testID?: string;
};

/** Hosted placeholder at an RN boundary. Use SkeletonContent inside an existing Host. */
export function Skeleton({ animate = true, ...props }: SkeletonProps) {
  return animate ? <AnimatedSkeleton {...props} /> : <HostedSkeleton {...props} />;
}

function AnimatedSkeleton(props: Omit<SkeletonProps, 'animate'>) {
  const enabled = useMotionEnabled();
  return <HostedSkeleton {...props} pulse={enabled} animated />;
}

function HostedSkeleton({
  colorScheme,
  testID,
  style,
  pulse = false,
  animated = false,
}: Omit<SkeletonProps, 'animate'> & { pulse?: boolean; animated?: boolean }) {
  const hostProps: ComponentProps<typeof UniversalHost> = {
    colorScheme,
    inline: typeof style?.width === 'number',
    testID: testID ? `${testID}-container` : undefined,
    pointerEvents: 'none',
    accessible: false,
    accessibilityElementsHidden: true,
    importantForAccessibility: 'no-hide-descendants',
    children: <SkeletonShape colorScheme={colorScheme} testID={testID} style={style} />,
  };
  return animated ? (
    <AnimatedSkeletonHost {...hostProps} style={pulse ? pulseStyle : { opacity: 1 }} />
  ) : (
    <UniversalHost {...hostProps} style={{ opacity: 1 }} />
  );
}

/** Static placeholders skip the pulse clock and motion lifecycle subscriptions entirely. */
export function SkeletonContent({ animate = true, ...props }: SkeletonProps) {
  return animate ? <PulsingSkeletonContent {...props} /> : <SkeletonShape {...props} />;
}

function PulsingSkeletonContent(props: Omit<SkeletonProps, 'animate'>) {
  const pulse = useSkeletonPulse(true);
  return (
    <SkeletonShape
      {...props}
      dimmed={pulse.dimmed}
      animationDuration={pulse.enabled ? SKELETON_PULSE_DURATION_MS : undefined}
    />
  );
}

/** Native placeholder that inherits the owning Host's light/dark scheme. */
function SkeletonShape({
  colorScheme,
  testID,
  style = {},
  dimmed = false,
  animationDuration,
}: Omit<SkeletonProps, 'animate'> & { dimmed?: boolean; animationDuration?: number }) {
  const colors = useThemeColors(useHostColorScheme(colorScheme));
  return (
    <Column
      testID={testID}
      modifiers={skeletonModifiers({
        width: typeof style.width === 'number' ? style.width : undefined,
        height: style.height ?? 16,
        borderRadius: style.borderRadius ?? 12,
        backgroundColor: style.backgroundColor ?? colors.border,
        opacity: (style.opacity ?? 0.72) * (dimmed ? SKELETON_DIMMED_OPACITY : 1),
        animationDuration,
      })}
    />
  );
}
