import { Host } from "@/components/Universal/host";
import {
  Alert,
  Button as SwiftButton,
  Text as SwiftText,
} from "@expo/ui/swift-ui";
import { frame, hidden } from "@expo/ui/swift-ui/modifiers";
import type { ComponentProps } from "react";

import {
  createAlertProvider,
  descriptionToText,
  useAlert,
  type AlertRendererProps,
  type AlertVariant,
} from "./alert.shared";

type SystemImage = ComponentProps<typeof SwiftButton>["systemImage"];

const ICON_BY_VARIANT: Record<AlertVariant, SystemImage> = {
  default: "info.circle",
  primary: "info.circle",
  secondary: "info.circle",
  success: "checkmark.circle",
  warning: "exclamationmark.triangle",
  danger: "exclamationmark.circle",
};

const HIDDEN_TRIGGER_MODIFIERS = [
  frame({ width: 0, height: 0 }),
  hidden(),
];

function NativeAlert({ alert, onDismiss }: AlertRendererProps) {
  const description = descriptionToText(alert.description);

  return (
    <Host matchContents>
      <Alert
        isPresented
        onIsPresentedChange={(isPresented) => {
          if (!isPresented) onDismiss();
        }}
        title={alert.title ?? ""}
      >
        <Alert.Trigger>
          <SwiftText modifiers={HIDDEN_TRIGGER_MODIFIERS}> </SwiftText>
        </Alert.Trigger>
        <Alert.Actions>
          <SwiftButton
            label={alert.actionLabel}
            onPress={onDismiss}
            systemImage={ICON_BY_VARIANT[alert.variant]}
          />
        </Alert.Actions>
        {description ? (
          <Alert.Message>
            <SwiftText>{description}</SwiftText>
          </Alert.Message>
        ) : null}
      </Alert>
    </Host>
  );
}

const AlertProvider = createAlertProvider(NativeAlert);

export { ALERT_VARIANTS } from "./alert.shared";
export { AlertProvider, useAlert };
export type {
  AlertDescription,
  AlertShowOptions,
  AlertVariant,
} from "./alert.shared";
