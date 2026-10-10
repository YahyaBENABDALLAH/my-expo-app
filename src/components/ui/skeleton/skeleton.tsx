import { useThemeColors } from '@/hooks/use-theme';
import { Column } from '@expo/ui';
import { skeletonModifiers } from './skeleton-modifiers';
import { UniversalHost, useHostColorScheme } from '../universal-host';
import {
  SKELETON_DIMMED_OPACITY,
  SKELETON_PULSE_DURATION_MS,
  useSkeletonPulse,
} from './use-skeleton-pulse';

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
export function Skeleton({ animate, colorScheme, testID, style }: SkeletonProps) {
  return (
    <UniversalHost
      colorScheme={colorScheme}
      inline={typeof style?.width === 'number'}
      testID={testID ? `${testID}-container` : undefined}
      pointerEvents="none"
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <SkeletonContent animate={animate} colorScheme={colorScheme} testID={testID} style={style} />
    </UniversalHost>
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
