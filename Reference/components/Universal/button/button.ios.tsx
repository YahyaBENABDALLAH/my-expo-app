import { WithinHostContext } from "@/components/Universal/host-context";
import { Host } from "@/components/Universal/host";
import { Row } from "@/components/Universal/layout";
import { Text } from "@/components/Universal/text";
import { useTheme } from "@/context/theme.context";
import {
  Button as SwiftButton,
  ProgressView,
  ZStack,
} from "@expo/ui/swift-ui";
import {
  background,
  buttonStyle,
  clipShape,
  disabled as disabledModifier,
  frame,
  hidden as hiddenModifier,
  onAppear as onAppearModifier,
  onDisappear as onDisappearModifier,
  opacity,
  padding,
  progressViewStyle,
  strokeBorder,
  tint,
  type ModifierConfig,
} from "@expo/ui/swift-ui/modifiers";
import { useContext, type ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { resolveButtonVisuals } from "./button.shared";
import {
  BUTTON_SEMANTIC,
  BUTTON_SHAPE,
  BUTTON_SIZE,
  BUTTON_VARIANT,
  type ButtonProps,
  type ButtonShape,
} from "./types";

function resolveContent(children: ReactNode, label: string | undefined) {
  if (
    typeof children === "string" ||
    typeof children === "number" ||
    typeof children === "bigint"
  ) {
    return String(children);
  }

  return children ?? label ?? "";
}

function resolveClipShape(shape: ButtonShape, radius: number) {
  if (shape === BUTTON_SHAPE.PILL) return clipShape("capsule");
  if (shape === BUTTON_SHAPE.SQUARE) return clipShape("rectangle");
  return clipShape("roundedRectangle", radius);
}

function resolveStrokeShape(shape: ButtonShape) {
  if (shape === BUTTON_SHAPE.PILL) return "capsule" as const;
  if (shape === BUTTON_SHAPE.SQUARE) return "rectangle" as const;
  return "roundedRectangle" as const;
}

function omitButtonStyle(
  modifiers: ButtonProps["modifiers"],
): ModifierConfig[] {
  return (modifiers ?? []).filter(
    (modifier): modifier is ModifierConfig => modifier.$type !== "buttonStyle",
  );
}

export function Button({
  children,
  label,
  variant = BUTTON_VARIANT.FILLED,
  semantic = BUTTON_SEMANTIC.PRIMARY,
  size = BUTTON_SIZE.MD,
  shape = BUTTON_SHAPE.ROUNDED,
  loading = false,
  fullWidth = false,
  containerStyle,
  style,
  disabled = false,
  hidden = false,
  modifiers,
  onAppear,
  onDisappear,
  onPress,
  testID,
}: ButtonProps) {
  const { tokens } = useTheme();
  const withinHost = useContext(WithinHostContext);
  const isDisabled = disabled || loading;
  const buttonTokens = tokens.components.button;
  const visuals = resolveButtonVisuals({
    tokens: buttonTokens,
    variant,
    semantic,
    size,
    shape,
    disabled,
    style,
  });
  const isText = variant === BUTTON_VARIANT.TEXT;
  const resolvedWidth = style?.width;
  const resolvedHeight = style?.height ?? (isText ? undefined : visuals.size.height);
  const paddingAll = typeof style?.padding === "number" ? style.padding : undefined;
  const paddingHorizontal =
    typeof style?.paddingHorizontal === "number"
      ? style.paddingHorizontal
      : paddingAll ?? (isText ? 0 : visuals.size.paddingHorizontal);
  const paddingVertical =
    typeof style?.paddingVertical === "number"
      ? style.paddingVertical
      : paddingAll ?? (isText ? 0 : visuals.size.paddingVertical);
  const paddingTop =
    typeof style?.paddingTop === "number" ? style.paddingTop : paddingVertical;
  const paddingBottom =
    typeof style?.paddingBottom === "number"
      ? style.paddingBottom
      : paddingVertical;
  const paddingLeading =
    typeof style?.paddingLeft === "number"
      ? style.paddingLeft
      : paddingHorizontal;
  const paddingTrailing =
    typeof style?.paddingRight === "number"
      ? style.paddingRight
      : paddingHorizontal;
  const borderWidth =
    typeof style?.borderWidth === "number"
      ? style.borderWidth
      : variant === BUTTON_VARIANT.OUTLINED
        ? buttonTokens.borderWidth
        : 0;
  const surfaceModifiers: ModifierConfig[] = [];

  if (paddingTop || paddingBottom || paddingLeading || paddingTrailing) {
    surfaceModifiers.push(
      padding({
        top: paddingTop,
        bottom: paddingBottom,
        leading: paddingLeading,
        trailing: paddingTrailing,
      }),
    );
  }
  if (resolvedWidth != null || resolvedHeight != null) {
    surfaceModifiers.push(
      frame({ width: resolvedWidth, height: resolvedHeight }),
    );
  }
  if (fullWidth && resolvedWidth == null) {
    surfaceModifiers.push(frame({ maxWidth: Infinity }));
  }
  surfaceModifiers.push(background(visuals.background));
  surfaceModifiers.push(resolveClipShape(shape, visuals.radius));
  if (borderWidth > 0) {
    surfaceModifiers.push(
      strokeBorder({
        color: visuals.border,
        style: { lineWidth: borderWidth },
        shape: resolveStrokeShape(shape),
        cornerRadius: visuals.radius,
      }),
    );
  }
  if (style?.opacity != null) surfaceModifiers.push(opacity(style.opacity));

  const nativeModifiers = omitButtonStyle(modifiers);
  nativeModifiers.push(buttonStyle("plain"));
  if (onAppear) nativeModifiers.push(onAppearModifier(onAppear));
  if (onDisappear) nativeModifiers.push(onDisappearModifier(onDisappear));
  if (isDisabled) nativeModifiers.push(disabledModifier(true));
  if (hidden) nativeModifiers.push(hiddenModifier(true));

  const content = resolveContent(children, label);
  const buttonNode = (
    <SwiftButton
      modifiers={nativeModifiers}
      onPress={isDisabled ? undefined : onPress}
      testID={testID}
    >
      <Row alignment="center" modifiers={surfaceModifiers}>
        <ZStack alignment="center">
          <Row alignment="center" modifiers={loading ? [opacity(0)] : undefined}>
            {typeof content === "string" ? (
              <Text
                style={{
                  ...tokens.typography.control.button,
                  color: visuals.foreground,
                  fontSize: visuals.size.fontSize,
                  lineHeight: visuals.size.lineHeight,
                }}
              >
                {content}
              </Text>
            ) : (
              content
            )}
          </Row>
          {loading ? (
            <ProgressView
              modifiers={[
                progressViewStyle("circular"),
                tint(visuals.foreground),
                frame({
                  width: visuals.size.iconSize,
                  height: visuals.size.iconSize,
                }),
              ]}
            />
          ) : null}
        </ZStack>
      </Row>
    </SwiftButton>
  );

  if (withinHost) return buttonNode;

  return (
    <View
      style={[fullWidth ? styles.fullWidth : styles.intrinsic, containerStyle]}
    >
      <Host
        matchContents={fullWidth ? { vertical: true } : true}
        style={fullWidth ? styles.fullWidth : undefined}
      >
        {buttonNode}
      </Host>
    </View>
  );
}

const styles = StyleSheet.create({
  intrinsic: { alignSelf: "flex-start" },
  fullWidth: { alignSelf: "stretch", width: "100%" },
});
