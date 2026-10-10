import { useThemeColors } from '@/hooks/use-theme';
import { Column, Icon, Row, Text, TextInput, type IconProps, type TextInputProps } from '@expo/ui';
import { useRef, useState } from 'react';
import { View } from 'react-native';
import { UniversalHost, useHostColorScheme } from './universal-host';
import { nativeFillWidth } from './native-fill-width';
import { inputRowFlex } from './text-input-modifiers';
import { TextInputIconButton } from './text-input-icon-button';

export type InputStatus = 'default' | 'error' | 'success' | 'warning';

export interface UniversalTextInputProps extends TextInputProps {
  label?: string;
  helperText?: string;
  status?: InputStatus;
  disabled?: boolean;
  colorScheme?: 'light' | 'dark';
  /** Leading icon (mirrors in RTL). Use Icon.select({ ios, android }). */
  leftIcon?: IconProps['name'];
  /** Trailing icon/action (mirrors in RTL). */
  rightIcon?: IconProps['name'];
  onRightIconPress?: () => void;
  /** Supply a screen-reader action label whenever onRightIconPress is set. */
  rightIconAccessibilityLabel?: string;
  palette?: {
    text: string;
    muted: string;
    tint: string;
    surface: string;
    border: string;
    error: string;
    success: string;
    warning: string;
    selection?: string;
  };
  /** Observes touches on the input container without intercepting native focus. */
  onPress?: () => void;
}

/** Adapter for an input embedded in a React Native layout. */
export function UniversalTextInput({
  colorScheme,
  disabled = false,
  onPress,
  ...props
}: UniversalTextInputProps) {
  const [containerWidth, setContainerWidth] = useState(0);
  return (
    <View
      testID={props.testID ? `${props.testID}-container` : undefined}
      collapsable={false}
      pointerEvents={disabled ? 'none' : 'auto'}
      onTouchStart={disabled ? undefined : onPress}
      onLayout={({ nativeEvent }) => setContainerWidth(Math.round(nativeEvent.layout.width))}
    >
      {containerWidth > 0 ? (
        <UniversalHost colorScheme={colorScheme}>
          <UniversalTextInputContent
            {...props}
            colorScheme={colorScheme}
            disabled={disabled}
            style={{ width: containerWidth, ...props.style }}
          />
        </UniversalHost>
      ) : null}
    </View>
  );
}

/** Native field composition; the caller owns Host and native layout constraints. */
export function UniversalTextInputContent({
  label,
  helperText,
  status = 'default',
  disabled = false,
  colorScheme,
  palette,
  editable,
  readOnly,
  onFocus,
  onBlur,
  style,
  textStyle,
  leftIcon,
  rightIcon,
  onRightIconPress,
  rightIconAccessibilityLabel,
  ...inputProps
}: Omit<UniversalTextInputProps, 'onPress'>) {
  const scheme = useHostColorScheme(colorScheme);
  const [focused, setFocused] = useState(false);
  const focusedRef = useRef(false);
  const themeColors = useThemeColors(scheme);
  const colors = palette ?? themeColors;
  const semanticColor = status === 'default' ? undefined : colors[status];
  const hasIconAction = rightIcon != null && !!onRightIconPress;
  const contentStyle = { opacity: disabled ? 0.5 : 1 };
  const fieldStyle = {
    paddingHorizontal: style?.paddingHorizontal ?? style?.padding ?? 14,
    paddingVertical: style?.paddingVertical ?? style?.padding ?? 14,
    // Expo UI maps paddingRight to native trailing/end, including in RTL.
    ...(hasIconAction
      ? { paddingRight: style?.paddingRight ?? style?.paddingHorizontal ?? style?.padding ?? 2 }
      : {}),
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: semanticColor ?? (focused ? colors.tint : colors.border),
    ...style,
  };
  // Keep vertical spacing on the text, not around the icon's native tap target.
  // Resolve overrides once so custom padding cannot be applied to both layers.
  const inputPadding = {
    paddingTop: fieldStyle.paddingTop ?? fieldStyle.paddingVertical,
    paddingBottom: fieldStyle.paddingBottom ?? fieldStyle.paddingVertical,
  };
  const input = (
    <TextInput
      {...inputProps}
      modifiers={[...inputRowFlex, ...(inputProps.modifiers ?? [])]}
      readOnly={readOnly}
      editable={disabled ? false : editable}
      placeholderTextColor={inputProps.placeholderTextColor ?? colors.muted}
      cursorColor={inputProps.cursorColor ?? colors.tint}
      selectionColor={inputProps.selectionColor ?? colors.selection ?? themeColors.selection}
      selectionHandleColor={inputProps.selectionHandleColor ?? colors.tint}
      onFocus={() => {
        if (focusedRef.current) return;
        focusedRef.current = true;
        setFocused(true);
        onFocus?.();
      }}
      onBlur={() => {
        // Compose reports its initial unfocused state when the input mounts.
        if (!focusedRef.current) return;
        focusedRef.current = false;
        setFocused(false);
        onBlur?.();
      }}
      style={{ ...inputPadding, ...contentStyle }}
      textStyle={{ fontSize: 16, color: colors.text, ...textStyle }}
    />
  );

  return (
    <Column
      spacing={8}
      modifiers={style?.width === undefined ? nativeFillWidth : undefined}
      style={{ width: style?.width }}
    >
      {label ? (
        <Text
          testID={inputProps.testID ? `${inputProps.testID}-label` : undefined}
          textStyle={{ fontSize: 14, fontWeight: '600', color: colors.text }}
        >
          {label}
        </Text>
      ) : null}
      {/* Keep the field surface and border outside the disabled content opacity. */}
      <Row
        alignment="center"
        spacing={8}
        style={{ ...fieldStyle, paddingVertical: 0, paddingTop: 0, paddingBottom: 0 }}
        modifiers={style?.width === undefined ? nativeFillWidth : undefined}
      >
        {leftIcon != null ? (
          <Icon
            name={leftIcon}
            size={20}
            color={colors.muted}
            style={contentStyle}
            testID={inputProps.testID ? `${inputProps.testID}-left-icon` : undefined}
          />
        ) : null}
        {input}
        {rightIcon != null ? (
          onRightIconPress ? (
            <TextInputIconButton
              disabled={disabled}
              onPress={disabled ? undefined : onRightIconPress}
              accessibilityLabel={rightIconAccessibilityLabel}
              testID={inputProps.testID ? `${inputProps.testID}-right-icon` : undefined}
            >
              <Icon name={rightIcon} size={20} color={colors.tint} style={contentStyle} />
            </TextInputIconButton>
          ) : (
            <Icon
              name={rightIcon}
              size={20}
              color={colors.muted}
              style={contentStyle}
              testID={inputProps.testID ? `${inputProps.testID}-right-icon` : undefined}
            />
          )
        ) : null}
      </Row>
      {helperText ? (
        <Text
          testID={inputProps.testID ? `${inputProps.testID}-helper` : undefined}
          textStyle={{ fontSize: 13, color: semanticColor ?? colors.muted }}
        >
          {helperText}
        </Text>
      ) : null}
    </Column>
  );
}
