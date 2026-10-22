import { spacing } from '@/constants/layout';
import { translateValidationMessage } from '@/lib/i18n';
import { useTranslation } from 'react-i18next';
import { Column, Icon } from '@expo/ui';
import { nativeFillWidth, nativeFillWidthEnd } from '../native/native-fill-width';
import { useEffect, useRef, useState } from 'react';
import { useController, type Control, type FieldPath, type FieldValues } from 'react-hook-form';

import { UniversalButtonContent } from '../button/universal-button-content';
import { UniversalTextContent as Text } from '../text/universal-text';
import { TextInput, type TextInputProps } from '../text-input/text-input';
import { useHostColorScheme } from '../host/universal-host';
import { useThemeColors } from '@/hooks/use-theme';
import { notifyValidationError } from '@/lib/validation-feedback';

type Props<T extends FieldValues> = Omit<
  TextInputProps,
  'value' | 'defaultValue' | 'ref' | 'onChangeText' | 'onBlur' | 'status'
> & {
  control: Control<T>;
  name: FieldPath<T>;
  password?: boolean;
  passwordToggle?: 'button' | 'icon';
  onEdited?: () => void;
};

function passwordInputOverrides(
  password: boolean,
  shown: boolean,
  toggle: 'button' | 'icon',
  onToggle: () => void,
  actionLabel: string,
): Partial<TextInputProps> {
  if (!password) return {};
  const secureTextEntry = !shown;
  if (toggle === 'button') return { secureTextEntry };
  return {
    secureTextEntry,
    rightIcon: Icon.select({
      ios: shown ? 'eye.slash' : 'eye',
      android: shown
        ? require('@expo/material-symbols/visibility_off.xml')
        : require('@expo/material-symbols/visibility.xml'),
    }),
    onRightIconPress: onToggle,
    rightIconAccessibilityLabel: actionLabel,
  };
}

export function FormTextInput<T extends FieldValues>({
  control,
  name,
  password = false,
  passwordToggle = 'button',
  onEdited,
  helperText,
  testID,
  ...props
}: Props<T>) {
  const { t } = useTranslation();
  const { field, fieldState } = useController({ control, name });
  const value = typeof field.value === 'string' ? field.value : '';
  const [showPassword, setShowPassword] = useState(false);
  const colors = useThemeColors(useHostColorScheme());
  const invalid = Boolean(fieldState.error);
  const wasInvalid = useRef(false);
  const message = translateValidationMessage(fieldState.error?.message) ?? helperText;
  const messageSuffix = invalid ? 'error' : 'helper';
  const passwordActionLabel = showPassword ? t('auth.hidePassword') : t('auth.showPassword');
  const togglePassword = () => setShowPassword((shown) => !shown);

  useEffect(() => {
    if (invalid && !wasInvalid.current) notifyValidationError();
    wasInvalid.current = invalid;
  }, [invalid]);

  return (
    <Column spacing={spacing.sm} modifiers={nativeFillWidth}>
      <TextInput
        {...props}
        {...passwordInputOverrides(
          password,
          showPassword,
          passwordToggle,
          togglePassword,
          passwordActionLabel,
        )}
        testID={testID}
        ref={(input) => field.ref(input)}
        value={value}
        palette={colors}
        onBlur={() => field.onBlur()}
        onChangeText={(text) => {
          field.onChange(text);
          onEdited?.();
        }}
        status={invalid ? 'error' : 'default'}
      />
      {message ? (
        <Text
          testID={testID ? `${testID}-${messageSuffix}` : undefined}
          modifiers={nativeFillWidth}
          textStyle={{ color: invalid ? colors.error : colors.muted, fontSize: 14, lineHeight: 20 }}
        >
          {message}
        </Text>
      ) : null}
      {password && passwordToggle === 'button' ? (
        <Column alignment="end" modifiers={nativeFillWidthEnd}>
          <UniversalButtonContent
            testID={`${testID}-visibility`}
            variant="link"
            disabled={props.disabled}
            label={passwordActionLabel}
            onPress={togglePassword}
          />
        </Column>
      ) : null}
    </Column>
  );
}
