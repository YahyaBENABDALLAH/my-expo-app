import { useRef } from "react";
import { Pressable, type PressableProps, type GestureResponderEvent } from "react-native";

export interface SafePressableProps extends PressableProps {
  /**
   * Throttle time in milliseconds. Defaults to 800ms.
   */
  delay?: number;
}

/**
 * A drop-in replacement for React Native's Pressable that automatically
 * throttles double-taps to prevent duplicate navigation triggers.
 * Fully compatible with React Compiler (no useCallback).
 */
export function SafePressable({
  accessibilityRole,
  accessible,
  onPress,
  pointerEvents,
  delay = 800,
  ...props
}: SafePressableProps) {
  const lastPressTime = useRef(0);

  const handlePress = (event: GestureResponderEvent) => {
    if (!onPress) return;
    const now = Date.now();
    if (now - lastPressTime.current >= delay) {
      lastPressTime.current = now;
      onPress(event);
    }
  };

  return (
    <Pressable
      accessibilityRole={accessibilityRole ?? (onPress ? "button" : undefined)}
      accessible={accessible ?? Boolean(onPress)}
      onPress={handlePress}
      pointerEvents={pointerEvents ?? (onPress ? "box-only" : undefined)}
      {...props}
    />
  );
}
