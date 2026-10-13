import { Icon, RNHostView } from '@expo/ui';
import { useEffect } from 'react';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useMotionEnabled } from '@/hooks/use-motion-enabled';
import { useThemeColors } from '@/hooks/use-theme';
import { UniversalHost, useHostColorScheme } from '../host/universal-host';

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
  const scale = useSharedValue(1);
  const offset = useSharedValue(0);
  const opacity = useSharedValue(1);
  useEffect(() => {
    cancelAnimation(scale);
    cancelAnimation(offset);
    cancelAnimation(opacity);
    scale.set(1);
    offset.set(0);
    opacity.set(1);
    if (!motion) return;
    const timing = { duration: 180, easing: Easing.bezier(0.23, 1, 0.32, 1) };
    if (status === 'error') {
      const shake = { duration: 50, easing: Easing.bezier(0.77, 0, 0.175, 1) };
      offset.set(
        withSequence(
          withTiming(-6, shake),
          withTiming(6, shake),
          withTiming(-3, shake),
          withTiming(0, shake),
        ),
      );
    } else {
      scale.set(0.92);
      opacity.set(0.4);
      scale.set(withTiming(1, timing));
      opacity.set(withTiming(1, timing));
    }
    return () => {
      cancelAnimation(scale);
      cancelAnimation(offset);
      cancelAnimation(opacity);
    };
  }, [motion, status, scale, offset, opacity]);
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.get(),
    transform: [{ translateX: offset.get() }, { scale: scale.get() }],
  }));
  const success = status === 'success';
  const error = status === 'error';
  return (
    // A fixed-size RN boundary is needed only to animate the native status artwork.
    <RNHostView matchContents>
      <Animated.View
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
          animatedStyle,
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
