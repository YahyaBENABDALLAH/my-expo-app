import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

let lastFeedbackAt = -Infinity;

export function notifyValidationError() {
  const now = Date.now();
  // Several fields can become invalid during the same submit.
  if (now - lastFeedbackAt < 250) return;
  lastFeedbackAt = now;
  const feedback =
    Platform.OS === 'android'
      ? Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Reject)
      : Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  void feedback.catch(() => {
    // Validation still works when the device cannot provide haptics.
  });
}
