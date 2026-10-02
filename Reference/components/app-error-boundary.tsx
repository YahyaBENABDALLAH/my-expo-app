import type { ErrorBoundaryProps } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";

export function AppErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  const isDark = useColorScheme() === "dark";
  const [isRetrying, setIsRetrying] = useState(false);
  const palette = isDark ? DARK_PALETTE : LIGHT_PALETTE;

  const handleRetry = () => {
    if (isRetrying) return;

    setIsRetrying(true);
    void retry().finally(() => setIsRetrying(false));
  };

  return (
    <View
      accessibilityLiveRegion="assertive"
      accessibilityViewIsModal
      style={[styles.screen, { backgroundColor: palette.background }]}
      testID="app-error-boundary"
    >
      <View
        accessibilityRole="alert"
        style={[
          styles.card,
          {
            backgroundColor: palette.card,
            borderColor: palette.border,
          },
        ]}
      >
        <Text
          accessibilityRole="header"
          style={[styles.title, { color: palette.foreground }]}
        >
          Something went wrong
        </Text>
        <Text style={[styles.message, { color: palette.mutedForeground }]}>
          Foodiya could not open this screen. Try again.
        </Text>

        {__DEV__ ? (
          <Text
            numberOfLines={4}
            selectable
            style={[styles.details, { color: palette.destructive }]}
          >
            {error.message}
          </Text>
        ) : null}

        <Pressable
          accessibilityLabel="Retry loading screen"
          accessibilityRole="button"
          accessibilityState={{ busy: isRetrying, disabled: isRetrying }}
          disabled={isRetrying}
          onPress={handleRetry}
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: palette.primary,
              opacity: pressed || isRetrying ? 0.72 : 1,
            },
          ]}
        >
          <Text style={[styles.buttonLabel, { color: palette.onPrimary }]}>
            {isRetrying ? "Trying again…" : "Try again"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const LIGHT_PALETTE = {
  background: "#F7FAFA",
  border: "#D7E2E2",
  card: "#FFFFFF",
  destructive: "#B42318",
  foreground: "#133B3D",
  mutedForeground: "#526667",
  onPrimary: "#FFFFFF",
  primary: "#006D6F",
} as const;

const DARK_PALETTE = {
  background: "#0C1718",
  border: "#294142",
  card: "#142425",
  destructive: "#FFB4AB",
  foreground: "#E7F1F1",
  mutedForeground: "#B6C8C8",
  onPrimary: "#FFFFFF",
  primary: "#00A4A7",
} as const;

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: 14,
    justifyContent: "center",
    minHeight: 48,
    paddingHorizontal: 20,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "700",
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    gap: 16,
    maxWidth: 440,
    padding: 24,
    width: "100%",
  },
  details: {
    fontFamily: "monospace",
    fontSize: 12,
    lineHeight: 18,
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
  },
  screen: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    lineHeight: 32,
  },
});
