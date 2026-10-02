import { Button } from "@/components/Universal/button";
import { Host } from "@/components/Universal/host";
import { Column } from "@/components/Universal/layout";
import { Text } from "@/components/Universal/text";
import { Card } from "@/components/ui/surface";
import { useTheme } from "@/context/theme.context";
import { View } from "react-native";

interface QueryErrorStateProps {
  compact?: boolean;
  isRetrying?: boolean;
  message?: string;
  onRetry: () => unknown;
  retryLabel?: string;
  title?: string;
}

export function QueryErrorState({
  compact = false,
  isRetrying = false,
  message = "Check your connection and try again.",
  onRetry,
  retryLabel = "Try again",
  title = "Unable to load this content",
}: QueryErrorStateProps) {
  const { colors } = useTheme();

  return (
    <View accessibilityLiveRegion="assertive" accessibilityRole="alert">
      <Card
        elevation="none"
        outlined
        style={{
          paddingHorizontal: compact ? 16 : 24,
          paddingVertical: compact ? 16 : 24,
        }}
      >
        <Host
          matchContents={{ horizontal: false, vertical: true }}
          useViewportSizeMeasurement
        >
          <Column alignment="center" spacing={compact ? 8 : 12}>
            <Text
              semantic="destructive"
              variant={compact ? "large" : "h3"}
              style={{ textAlign: "center" }}
            >
              {title}
            </Text>
            <Text
              semantic="muted"
              style={{ lineHeight: 22, textAlign: "center" }}
            >
              {message}
            </Text>
            <Button
              disabled={isRetrying}
              loading={isRetrying}
              onPress={() => void onRetry()}
              semantic="primary"
              size={compact ? "sm" : "md"}
              style={{ borderColor: colors.border }}
            >
              {retryLabel}
            </Button>
          </Column>
        </Host>
      </Card>
    </View>
  );
}
