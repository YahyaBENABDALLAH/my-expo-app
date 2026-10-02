import { icons } from "@/components/Universal/icon";
import {
  ControlledTextInput,
  type ControlledTextInputProps,
  type TextInputRef,
} from "@/components/Universal/text-input";
import { useTheme } from "@/context/theme.context";
import { forwardRef, useState } from "react";
import { useTranslation } from "react-i18next";

type PasswordFieldProps = Omit<
  ControlledTextInputProps,
  "secureTextEntry" | "leftIcon" | "rightIcon" | "onRightIconPress"
>;

export const PasswordField = forwardRef<TextInputRef, PasswordFieldProps>(
  (props, ref) => {
    const [visible, setVisible] = useState(false);
    const { colors, tokens } = useTheme();
    const { t } = useTranslation();

    return (
      <ControlledTextInput
        label={t("auth.password")}
        placeholder="••••••••"
        autoComplete="current-password"
        autoCapitalize="none"
        autoCorrect={false}
        {...props}
        ref={ref}
        secureTextEntry={!visible}
        leftIcon={{ icon: icons.lock, size: tokens.iconSize.lg, color: colors.primary }}
        rightIcon={{
          icon: visible ? icons.eye : icons.eyeOff,
          size: tokens.iconSize.lg,
          color: colors.primary,
          accessibilityLabel: t(visible ? "auth.hidePassword" : "auth.showPassword"),
          accessibilityState: { selected: visible },
        }}
        onRightIconPress={() => setVisible(value => !value)}
      />
    );
  },
);

PasswordField.displayName = "PasswordField";
