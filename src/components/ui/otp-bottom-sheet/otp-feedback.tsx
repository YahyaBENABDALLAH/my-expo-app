import { Icon, RNHostView } from '@expo/ui';
import type { ComponentProps } from 'react';
import Animated, { cubicBezier } from 'react-native-reanimated';
import { useMotionEnabled } from '@/hooks/use-motion-enabled';
import { useThemeColors } from '@/hooks/use-theme';
import { UniversalHost, useHostColorScheme } from '../host/universal-host';

const fadeIn = {
  animationName: {
    from: { opacity: 0.4, transform: [{ scale: 0.92 }] },
    to: { opacity: 1, transform: [{ scale: 1 }] },
  },
  animationDuration: 180,
  animationTimingFunction: cubicBezier(0.23, 1, 0.32, 1),
} satisfies ComponentProps<typeof Animated.View>['style'];

const shake = {
  animationName: {
    from: { transform: [{ translateX: 0 }] },
    '25%': { transform: [{ translateX: -6 }] },
    '50%': { transform: [{ translateX: 6 }] },
    '75%': { transform: [{ translateX: -3 }] },
    to: { transform: [{ translateX: 0 }] },
  },
  animationDuration: 200,
  animationTimingFunction: cubicBezier(0.77, 0, 0.175, 1),
} satisfies ComponentProps<typeof Animated.View>['style'];

export function OtpFeedback({
  status,
  visible,
}: {
  status: 'idle' | 'verifying' | 'resending' | 'error' | 'success';
  visible: boolean;
}) {
  if (!visible) return null;
  return <AnimatedOtpFeedback status={status} />;
}

function AnimatedOtpFeedback({
  status,
}: {
  status: 'idle' | 'verifying' | 'resending' | 'error' | 'success';
}) {
  const scheme = useHostColorScheme();
  const colors = useThemeColors(scheme);
  const motion = useMotionEnabled(true);
  const success = status === 'success';
  const error = status === 'error';
  return (
    // A fixed-size RN boundary is needed only to animate the native status artwork.
    <RNHostView matchContents>
      <Animated.View
        key={status}
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={[
          {
            width: 80,
            height: 80,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 26,
            backgroundColor: error ? colors.errorContainer : colors.successContainer,
          },
          motion ? (error ? shake : fadeIn) : undefined,
        ]}
      >
        <UniversalHost inline colorScheme={scheme} ignoreSafeArea="all">
          <Icon
            name={Icon.select({
              ios: success
                ? 'checkmark.shield.fill'
                : error
                  ? 'exclamationmark.shield.fill'
                  : 'lock.shield.fill',
              android: success
                ? require('@expo/material-symbols/verified_user.xml')
                : error
                  ? require('@expo/material-symbols/gpp_maybe.xml')
                  : require('@expo/material-symbols/shield_lock.xml'),
            })}
            size={36}
            color={error ? colors.error : colors.success}
          />
        </UniversalHost>
      </Animated.View>
    </RNHostView>
  );
}
