import { WithinHostContext } from "@/components/Universal/host-context";
import { Host } from "@/components/Universal/host";
import { Row } from "@/components/Universal/layout";
import { Text } from "@/components/Universal/text";
import { useTheme } from "@/context/theme.context";
import {
  Box,
  CircularProgressIndicator,
  Shape,
  Surface,
  type ShapeJSXElement,
} from "@expo/ui/jetpack-compose";
import {
  alpha,
  fillMaxWidth,
  height,
  padding,
  Shapes,
  size as fixedSize,
  testID as testIDModifier,
  width,
  type ModifierConfig,
} from "@expo/ui/jetpack-compose/modifiers";
import { useContext, useEffect, type ReactNode } from "react";
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

function resolveComposeShape(
  shape: ButtonShape,
  radius: number,
): { native: ShapeJSXElement; modifier: ReturnType<typeof Shapes.RoundedCorner> } {
  if (shape === BUTTON_SHAPE.PILL) {
    return {
      native: Shape.Pill({}),
      modifier: Shapes.Material.Pill,
    };
  }

  if (shape === BUTTON_SHAPE.SQUARE) {
    return {
      native: Shape.Rectangle({}),
      modifier: Shapes.Rectangle,
    };
  }

  const corners = {
    topStart: radius,
    topEnd: radius,
    bottomStart: radius,
    bottomEnd: radius,
  };

  return {
    native: Shape.RoundedCorner({ cornerRadii: corners }),
    modifier: Shapes.RoundedCorner(radius),
  };
}

const RESERVED_SURFACE_MODIFIERS = new Set([
  "alpha",
  "background",
  "border",
  "clip",
  "height",
  "padding",
  "paddingAll",
  "size",
  "width",
]);

function omitSurfaceModifiers(
  modifiers: ButtonProps["modifiers"],
): ModifierConfig[] {
  return (modifiers ?? []).filter(
    (modifier): modifier is ModifierConfig =>
      !RESERVED_SURFACE_MODIFIERS.has(modifier.$type),
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
  const paddingStart =
    typeof style?.paddingLeft === "number"
      ? style.paddingLeft
      : paddingHorizontal;
  const paddingEnd =
    typeof style?.paddingRight === "number"
      ? style.paddingRight
      : paddingHorizontal;
  const borderWidth =
    typeof style?.borderWidth === "number"
      ? style.borderWidth
      : variant === BUTTON_VARIANT.OUTLINED
        ? buttonTokens.borderWidth
        : 0;
  const composeShape = resolveComposeShape(shape, visuals.radius);
  const surfaceModifiers: ModifierConfig[] = [];
  const contentModifiers: ModifierConfig[] = [];

  if (resolvedWidth != null && resolvedHeight != null) {
    surfaceModifiers.push(fixedSize(resolvedWidth, resolvedHeight));
  } else {
    if (resolvedWidth != null) surfaceModifiers.push(width(resolvedWidth));
    if (resolvedHeight != null) surfaceModifiers.push(height(resolvedHeight));
  }
  if (fullWidth && resolvedWidth == null) {
    surfaceModifiers.push(fillMaxWidth());
  }

  if (paddingTop || paddingBottom || paddingStart || paddingEnd) {
    contentModifiers.push(
      padding(paddingStart, paddingTop, paddingEnd, paddingBottom),
    );
  }
  if (style?.opacity != null) surfaceModifiers.push(alpha(style.opacity));

  const nativeModifiers = omitSurfaceModifiers(modifiers);
  if (testID) nativeModifiers.push(testIDModifier(testID));

  useEffect(() => {
    onAppear?.();
    return () => onDisappear?.();
  }, [onAppear, onDisappear]);

  if (hidden) return null;

  const content = resolveContent(children, label);
  const contentNode = (
    <Box contentAlignment="center" modifiers={contentModifiers}>
      <Row alignment="center" modifiers={loading ? [alpha(0)] : undefined}>
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
        <CircularProgressIndicator
          color={visuals.foreground}
          modifiers={[
            fixedSize(visuals.size.iconSize, visuals.size.iconSize),
          ]}
        />
      ) : null}
    </Box>
  );
  const buttonNode = (
    <Surface
      border={
        borderWidth > 0
          ? { color: visuals.border, width: borderWidth }
          : undefined
      }
      color={visuals.background}
      contentColor={visuals.foreground}
      enabled={!isDisabled}
      modifiers={[...surfaceModifiers, ...nativeModifiers]}
      onClick={onPress}
      shape={composeShape.native}
    >
      {contentNode}
    </Surface>
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
