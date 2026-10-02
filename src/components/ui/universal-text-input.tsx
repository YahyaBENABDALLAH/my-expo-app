import { Column, Text, TextInput, type TextInputProps } from '@expo/ui';
import { useRef, useState } from 'react';
import { View } from 'react-native';
import Colors from '@/constants/colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { UniversalHost } from './universal-host';

export type InputStatus = 'default' | 'error' | 'success' | 'warning';

export interface UniversalTextInputProps extends TextInputProps {
  label?: string;
  helperText?: string;
  status?: InputStatus;
  disabled?: boolean;
  colorScheme?: 'light' | 'dark';
  /** Observes touches on the input container without intercepting native focus. */
  onPress?: () => void;
}

/** Native Expo UI field; value and selection retain the observable-state API. */
export function UniversalTextInput({
  label,
  helperText,
  status = 'default',
  disabled = false,
  colorScheme,
  editable,
  readOnly,
  onFocus,
  onBlur,
  onPress,
  style,
  textStyle,
  ...inputProps
}: UniversalTextInputProps) {
  const scheme = useColorScheme(colorScheme);
  const [focused, setFocused] = useState(false);
  const focusedRef = useRef(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const colors = Colors[scheme];
  const semanticColor = status === 'default' ? undefined : colors[status];

  return (
    <View
      testID={inputProps.testID ? `${inputProps.testID}-container` : undefined}
      collapsable={false}
      pointerEvents={disabled ? 'none' : 'auto'}
      onTouchStart={disabled ? undefined : onPress}
      onLayout={({ nativeEvent }) => setContainerWidth(Math.round(nativeEvent.layout.width))}
      style={{ opacity: disabled ? 0.5 : 1 }}
    >
      {containerWidth > 0 ? (
        <UniversalHost colorScheme={scheme}>
          <Column spacing={8} style={{ width: containerWidth }}>
            {label ? (
              <Text
                testID={inputProps.testID ? `${inputProps.testID}-label` : undefined}
                textStyle={{ fontSize: 14, fontWeight: '600', color: colors.text }}
              >
                {label}
              </Text>
            ) : null}
            <TextInput
              {...inputProps}
              readOnly={readOnly}
              editable={disabled ? false : editable}
              placeholderTextColor={inputProps.placeholderTextColor ?? colors.muted}
              cursorColor={inputProps.cursorColor ?? colors.tint}
              onFocus={() => {
                if (focusedRef.current) return;
                focusedRef.current = true;
                setFocused(true);
                onFocus?.();
              }}
              onBlur={() => {
                // Compose reports its initial unfocused state when the input mounts.
                // Only notify consumers after the input has actually received focus.
                if (!focusedRef.current) return;
                focusedRef.current = false;
                setFocused(false);
                onBlur?.();
              }}
              style={{
                width: containerWidth,
                paddingHorizontal: 14,
                paddingVertical: 14,
                backgroundColor: colors.surface,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: semanticColor ?? (focused ? colors.tint : colors.border),
                ...style,
              }}
              textStyle={{ fontSize: 16, color: colors.text, ...textStyle }}
            />
            {helperText ? (
              <Text
                testID={inputProps.testID ? `${inputProps.testID}-helper` : undefined}
                textStyle={{ fontSize: 13, color: semanticColor ?? colors.muted }}
              >
                {helperText}
              </Text>
            ) : null}
          </Column>
        </UniversalHost>
      ) : null}
    </View>
  );
}
