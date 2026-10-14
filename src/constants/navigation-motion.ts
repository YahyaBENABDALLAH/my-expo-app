import type { NativeStackNavigationOptions } from 'expo-router';
import { Platform } from 'react-native';

export function stackMotionOptions(reducedMotion: boolean): NativeStackNavigationOptions {
  return {
    animation: reducedMotion ? 'none' : Platform.OS === 'android' ? 'fade' : 'simple_push',
    // Android's native fade is 150 ms; animationDuration only applies on iOS.
    ...(Platform.OS === 'ios' ? { animationDuration: 220, animationMatchesGesture: true } : {}),
  };
}
