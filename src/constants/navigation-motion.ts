import type { NativeStackNavigationOptions } from 'expo-router';
import { Platform } from 'react-native';

export function stackMotionOptions(reducedMotion: boolean): NativeStackNavigationOptions {
  return {
    // Sliding opaque scenes keeps text from different routes from cross-fading together.
    animation: reducedMotion
      ? 'none'
      : Platform.OS === 'android'
        ? 'slide_from_right'
        : 'simple_push',
    // animationDuration only applies on iOS.
    ...(Platform.OS === 'ios' ? { animationDuration: 220, animationMatchesGesture: true } : {}),
  };
}
