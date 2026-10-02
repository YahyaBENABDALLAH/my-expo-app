import { Host } from "@/components/Universal/host";
import { icons, type AppIconName } from "@/components/Universal/icon";
import { useTheme } from "@/context/theme.context";
import {
  AlertDialog,
  Icon,
  Text,
  TextButton,
} from "@expo/ui/jetpack-compose";
import type { ImageSourcePropType } from "react-native";

import {
  createAlertProvider,
  descriptionToText,
  useAlert,
  type AlertRendererProps,
  type AlertVariant,
} from "./alert.shared";

const ICON_BY_VARIANT: Record<AlertVariant, AppIconName> = {
  default: icons.info,
  primary: icons.info,
  secondary: icons.info,
  success: icons.checkCircle,
  warning: icons.alertTriangle,
  danger: icons.alertCircle,
};

function NativeAlert({ alert, onDismiss }: AlertRendererProps) {
  const { tokens } = useTheme();
  const { colors } = tokens;
  const semanticColor =
    alert.variant === "danger"
      ? colors.destructive
      : colors[alert.variant];
  const description = descriptionToText(alert.description);

  return (
    <Host matchContents>
      <AlertDialog
        colors={{
          containerColor: colors.popover,
          iconContentColor: semanticColor,
          titleContentColor: colors.popoverForeground,
          textContentColor: colors.mutedForeground,
        }}
        onDismissRequest={onDismiss}
      >
        <AlertDialog.Icon>
          <Icon
            contentDescription={alert.title}
            source={ICON_BY_VARIANT[alert.variant] as ImageSourcePropType}
            tint={semanticColor}
          />
        </AlertDialog.Icon>
        {alert.title ? (
          <AlertDialog.Title>
            <Text color={colors.popoverForeground}>{alert.title}</Text>
          </AlertDialog.Title>
        ) : null}
        {description ? (
          <AlertDialog.Text>
            <Text color={colors.mutedForeground}>{description}</Text>
          </AlertDialog.Text>
        ) : null}
        <AlertDialog.ConfirmButton>
          <TextButton
            colors={{
              containerColor: "transparent",
              contentColor: semanticColor,
            }}
            onClick={onDismiss}
          >
            <Text color={semanticColor}>{alert.actionLabel}</Text>
          </TextButton>
        </AlertDialog.ConfirmButton>
      </AlertDialog>
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
