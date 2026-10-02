import type { IconProps } from "@/components/Universal/icon";
import type {
  TextInputProps as ExpoTextInputProps,
  TextInputRef as ExpoTextInputRef,
  UniversalStyle,
  UniversalTextStyle,
} from "@expo/ui";
import type { ReactElement } from "react";
import type { AccessibilityState, StyleProp, ViewStyle } from "react-native";

export type TextInputRef = ExpoTextInputRef;

export interface TextInputIconOptions {
  icon: IconProps["name"];
  size?: IconProps["size"];
  color?: IconProps["color"];
  accessibilityLabel?: IconProps["accessibilityLabel"];
  accessibilityState?: AccessibilityState;
  onPress?: IconProps["onPress"];
}

export type TextInputIcon = ReactElement | TextInputIconOptions;

export interface TextInputProps
  extends Omit<ExpoTextInputProps, "ref" | "style" | "textStyle"> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: TextInputIcon;
  rightIcon?: TextInputIcon;
  onRightIconPress?: () => void;
  /** Outer React Native wrapper; style below applies to the field itself. */
  containerStyle?: StyleProp<ViewStyle>;
  labelTextStyle?: UniversalTextStyle;
  style?: UniversalStyle;
  textStyle?: UniversalTextStyle;
  elevated?: boolean;
}
