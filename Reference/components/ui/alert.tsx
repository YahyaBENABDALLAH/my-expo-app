import { useEffect } from "react";
import { Alert as ReactNativeAlert } from "react-native";

import {
  createAlertProvider,
  descriptionToText,
  useAlert,
  type AlertRendererProps,
} from "./alert.shared";

function PlatformAlert({ alert, onDismiss }: AlertRendererProps) {
  useEffect(() => {
    ReactNativeAlert.alert(
      alert.title ?? "",
      descriptionToText(alert.description),
      [{ text: alert.actionLabel, onPress: onDismiss }],
      { cancelable: true, onDismiss },
    );
  }, [alert, onDismiss]);

  return null;
}

const AlertProvider = createAlertProvider(PlatformAlert);

export { ALERT_VARIANTS } from "./alert.shared";
export { AlertProvider, useAlert };
export type {
  AlertDescription,
  AlertShowOptions,
  AlertVariant,
} from "./alert.shared";
