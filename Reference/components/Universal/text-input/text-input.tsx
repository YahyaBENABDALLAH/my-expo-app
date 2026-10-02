import { Host } from "@/components/Universal/host";
import { Icon } from "@/components/Universal/icon";
import { Text } from "@/components/Universal/text";
import {
  STATE_OPACITY,
  TYPOGRAPHY,
  type ThemeTokens,
} from "@/constants/theme.tokens";
import { useTheme } from "@/context/theme.context";
import { TextInput as ExpoTextInput } from "@expo/ui";
import { forwardRef, isValidElement, useState } from "react";
import {
  I18nManager,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import type {
  TextInputIcon,
  TextInputIconOptions,
  TextInputProps,
  TextInputRef,
} from "./types";

type TextInputTokens = ThemeTokens["components"]["textInput"];

function getInputPaddingVertical(
  multiline: boolean,
  height: number,
  lineHeight: number,
  tokens: TextInputTokens,
): number {
  if (multiline) {
    return tokens.contentPaddingVertical;
  }

  if (Platform.OS !== "android") {
    return 0;
  }

  // Compose needs explicit vertical centering for single-line fields.
  return Math.max(0, Math.floor((height - lineHeight) / 2));
}

function getInputLayout({
  style,
  multiline,
  hasLeftIcon,
  hasRightIcon,
  textStyle,
  tokens,
}: Pick<TextInputProps, "style" | "textStyle"> & {
  multiline: boolean;
  hasLeftIcon: boolean;
  hasRightIcon: boolean;
  tokens: TextInputTokens;
}) {
  const height =
    typeof style?.height === "number"
      ? style.height
      : multiline
        ? tokens.multilineHeight
        : tokens.height;

  const lineHeight =
    textStyle?.lineHeight ?? TYPOGRAPHY.control.input.lineHeight;

  const paddingHorizontal =
    style?.paddingHorizontal ??
    style?.padding ??
    tokens.contentPaddingHorizontal;

  const defaultPaddingVertical = getInputPaddingVertical(
    multiline,
    height,
    lineHeight,
    tokens,
  );

  return {
    height,
    paddingLeft:
      style?.paddingLeft ??
      (hasLeftIcon ? tokens.iconTextPadding : paddingHorizontal),
    paddingRight: style?.paddingRight ?? (hasRightIcon ? 0 : paddingHorizontal),
    paddingTop:
      style?.paddingTop ??
      style?.paddingVertical ??
      style?.padding ??
      defaultPaddingVertical,
    paddingBottom:
      style?.paddingBottom ??
      style?.paddingVertical ??
      style?.padding ??
      defaultPaddingVertical,
  };
}

function isIconOptions(icon: TextInputIcon): icon is TextInputIconOptions {
  return !isValidElement(icon) && "icon" in icon;
}

function renderIcon(icon: TextInputIcon) {
  if (isValidElement(icon)) {
    return icon;
  }

  return (
    <Icon
      name={icon.icon}
      size={icon.size}
      color={icon.color}
      accessibilityLabel={icon.accessibilityLabel}
    />
  );
}

function LeftIcon({ icon, inset }: { icon?: TextInputIcon; inset: number }) {
  if (!icon) {
    return null;
  }

  return (
    <View pointerEvents="none" style={[styles.leftIcon, { left: inset }]}>
      {renderIcon(icon)}
    </View>
  );
}

function RightIcon({
  icon,
  onPress,
  disabled,
  inset,
  slotWidth,
}: {
  icon?: TextInputIcon;
  onPress?: () => void;
  disabled: boolean;
  inset: number;
  slotWidth: number;
}) {
  if (!icon) {
    return null;
  }

  const iconOptions = isIconOptions(icon) ? icon : undefined;

  const handlePress = onPress ?? iconOptions?.onPress;

  return (
    <Pressable
      accessibilityRole={handlePress ? "button" : undefined}
      accessibilityLabel={iconOptions?.accessibilityLabel}
      accessibilityState={{
        ...iconOptions?.accessibilityState,
        disabled: disabled || !handlePress,
      }}
      style={({ pressed }) => [
        styles.rightIcon,
        {
          width: slotWidth,
          paddingRight: inset,
          opacity: pressed ? STATE_OPACITY.pressed : 1,
        },
      ]}
      onPress={handlePress}
      disabled={disabled || !handlePress}
    >
      <View
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        {renderIcon(icon)}
      </View>
    </Pressable>
  );
}

function FieldLabel({
  label,
  textStyle,
}: {
  label?: string;
  textStyle?: TextInputProps["labelTextStyle"];
}) {
  if (!label) {
    return null;
  }

  return (
    <View pointerEvents="none">
      <Text variant="small" semantic="muted" style={textStyle}>
        {label}
      </Text>
    </View>
  );
}

function FieldMessage({
  error,
  helperText,
  tokens,
}: Pick<TextInputProps, "error" | "helperText"> & {
  tokens: TextInputTokens;
}) {
  const message = error ?? helperText;

  if (!message) {
    return null;
  }

  return (
    <View
      style={[
        styles.messageSlot,
        {
          paddingHorizontal: error
            ? tokens.errorPadding
            : tokens.messagePadding,
        },
      ]}
    >
      <Text variant="caption" semantic={error ? "destructive" : "muted"}>
        {message}
      </Text>
    </View>
  );
}

export const TextInput = forwardRef<TextInputRef, TextInputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      onRightIconPress,
      containerStyle,
      labelTextStyle,
      style,
      textStyle,
      elevated = false,

      editable,
      readOnly,
      multiline = false,
      placeholderTextColor,
      cursorColor,
      selectionColor,
      textAlign,
      onFocus,
      onBlur,

      ...inputProps
    },
    ref,
  ) => {
    const { tokens } = useTheme();
    const [focused, setFocused] = useState(false);
    const inputTokens = tokens.components.textInput;
    const colors = inputTokens.color;

    const isEditable = editable ?? !readOnly;

    const layout = getInputLayout({
      style,
      multiline,
      hasLeftIcon: Boolean(leftIcon),
      hasRightIcon: Boolean(rightIcon),
      textStyle,
      tokens: inputTokens,
    });

    const borderRadius =
      style?.borderRadius ??
      (multiline ? inputTokens.multilineRadius : inputTokens.radius);

    return (
      <View
        style={[
          styles.container,
          {
            gap: inputTokens.contentGap,
          },
          containerStyle,
        ]}
      >
        <FieldLabel label={label} textStyle={labelTextStyle} />
        <View
          style={[
            styles.field,
            {
              width: style?.width ?? "100%",
              height: layout.height,
              backgroundColor: style?.backgroundColor ?? colors.background,
              borderColor: error
                ? colors.error
                : focused
                  ? tokens.colors.primary
                  : (style?.borderColor ?? colors.border),
              borderRadius,
              borderWidth: style?.borderWidth ?? inputTokens.borderWidth,
              opacity:
                style?.opacity ??
                (isEditable ? 1 : inputTokens.disabledOpacity),
            },

            elevated ? tokens.shadows.floatingAction : null,
          ]}
        >
          <LeftIcon icon={leftIcon} inset={inputTokens.iconInset} />
          <Host style={[styles.host, { height: layout.height }]}>
            <ExpoTextInput
              {...inputProps}
              ref={ref}
              editable={editable}
              readOnly={readOnly}
              multiline={multiline}
              onFocus={() => {
                setFocused(true);
                onFocus?.();
              }}
              onBlur={() => {
                setFocused(false);
                onBlur?.();
              }}
              placeholderTextColor={placeholderTextColor ?? colors.placeholder}
              cursorColor={cursorColor ?? colors.cursor}
              selectionColor={selectionColor ?? colors.selection}
              textAlign={textAlign ?? (I18nManager.isRTL ? "right" : "left")}
              style={{
                width:
                  typeof style?.width === "number" ? style.width : undefined,
                height: layout.height,
                paddingLeft: layout.paddingLeft,
                paddingRight: layout.paddingRight,
                paddingTop: layout.paddingTop,
                paddingBottom: layout.paddingBottom,
                backgroundColor: "transparent",
                borderRadius,
              }}
              textStyle={{
                ...TYPOGRAPHY.control.input,
                color: colors.foreground,
                ...textStyle,
              }}
            />
          </Host>
          <RightIcon
            icon={rightIcon}
            onPress={onRightIconPress}
            disabled={!isEditable}
            inset={inputTokens.iconInset}
            slotWidth={inputTokens.iconSlotWidth}
          />
        </View>
        <FieldMessage
          error={error}
          helperText={helperText}
          tokens={inputTokens}
        />
      </View>
    );
  },
);

TextInput.displayName = "TextInput";

const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
  },
  field: {
    flexDirection: "row",
    alignItems: "center",
  },
  messageSlot: {
    alignSelf: "stretch",
  },
  host: {
    flex: 1,
  },
  leftIcon: {
    position: "absolute",
    zIndex: 1,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  rightIcon: {
    height: "100%",
    justifyContent: "center",
    alignItems: "flex-end",
  },
});
