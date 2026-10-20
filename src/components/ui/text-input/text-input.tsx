import { radii, spacing } from '@/constants/layout';
import { useThemeColors } from '@/hooks/use-theme';
import {
  Column,
  Icon,
  Row,
  Text,
  TextInput as ExpoTextInput,
  useNativeState,
  type IconProps,
  type TextInputProps as ExpoTextInputProps,
} from '@expo/ui';
import { useEffect, useRef, useState } from 'react';
import { useHostColorScheme } from '../host/universal-host';
import { nativeFillWidth } from '../native/native-fill-width';
import { inputFieldAppearance, inputRowFlex } from './text-input-modifiers';
import { TextInputIconButton } from './text-input-icon-button';

export type InputStatus = 'default' | 'error' | 'success' | 'warning';

export interface TextInputProps extends Omit<ExpoTextInputProps, 'value'> {
  /** Controlled text. Native observable state is managed by this component. */
  value?: string;
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
}

/** Shared native input; compose inside an existing UniversalHost. */
export function TextInput({
  value,
  defaultValue,
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
}: TextInputProps) {
  const nativeValue = useNativeState(value ?? defaultValue ?? '');
  useEffect(() => {
    // Synchronize external edits/resets while retaining the same native field and ref.
    if (value !== undefined && nativeValue.get() !== value) nativeValue.set(value);
  }, [nativeValue, value]);
  const scheme = useHostColorScheme(colorScheme);
  const focusedRef = useRef(false);
  const [focused, setFocused] = useState(false);
  const themeColors = useThemeColors(scheme);
  const colors = palette ?? themeColors;
  const semanticColor = status === 'default' ? undefined : colors[status];
  const contentStyle = { opacity: disabled ? 0.5 : 1 };
  const iconStyle = { width: 20, height: 20, ...contentStyle };
  const fieldAppearance = inputFieldAppearance({
    paddingHorizontal: style?.paddingHorizontal ?? style?.padding ?? spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radii.control,
    borderWidth: 1,
    borderColor: semanticColor ?? (focused && !disabled ? colors.tint : colors.border),
    ...style,
  });
  const input = (
    <ExpoTextInput
      {...inputProps}
      value={nativeValue}
      modifiers={[...inputRowFlex, ...(inputProps.modifiers ?? [])]}
      readOnly={readOnly}
      editable={disabled ? false : editable}
      placeholderTextColor={inputProps.placeholderTextColor ?? colors.muted}
      cursorColor={inputProps.cursorColor ?? palette?.tint}
      selectionColor={inputProps.selectionColor ?? palette?.selection}
      selectionHandleColor={inputProps.selectionHandleColor ?? palette?.tint}
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
      style={contentStyle}
      textStyle={{ color: colors.text, ...textStyle }}
    />
  );

  return (
    <Column
      spacing={spacing.sm}
      modifiers={style?.width === undefined ? nativeFillWidth : undefined}
      style={{ width: style?.width }}
    >
      {label ? (
        <Text
          testID={inputProps.testID ? `${inputProps.testID}-label` : undefined}
          textStyle={{ color: colors.text }}
        >
          {label}
        </Text>
      ) : null}
      {/* Keep the field surface and border outside the disabled content opacity. */}
      <Row
        alignment="center"
        spacing={spacing.sm}
        style={fieldAppearance.style}
        modifiers={fieldAppearance.modifiers}
      >
        {leftIcon != null ? (
          <Icon
            name={leftIcon}
            size={20}
            color={colors.muted}
            style={iconStyle}
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
              <Icon name={rightIcon} size={20} color={colors.tint} style={iconStyle} />
            </TextInputIconButton>
          ) : (
            <Icon
              name={rightIcon}
              size={20}
              color={colors.muted}
              style={iconStyle}
              testID={inputProps.testID ? `${inputProps.testID}-right-icon` : undefined}
            />
          )
        ) : null}
      </Row>
      {helperText ? (
        <Text
          testID={inputProps.testID ? `${inputProps.testID}-helper` : undefined}
          textStyle={{ color: semanticColor ?? colors.muted }}
        >
          {helperText}
        </Text>
      ) : null}
    </Column>
  );
}
