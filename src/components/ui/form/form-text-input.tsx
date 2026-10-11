import { translateValidationMessage } from '@/lib/i18n';
import { useTranslation } from 'react-i18next';
import { Column, useNativeState } from '@expo/ui';
import { nativeFillWidth, nativeFillWidthEnd } from '../native/native-fill-width';
import { useEffect, useRef, useState } from 'react';
import { useController, type Control, type FieldPath, type FieldValues } from 'react-hook-form';

import { UniversalButtonContent } from '../button/universal-button-content';
import { UniversalTextContent as AuthText } from '../text/universal-text';
import { authInputIcons } from '../auth/auth-input-icons';
import {
  UniversalTextInputContent,
  type UniversalTextInputProps,
} from '../text-input/universal-text-input';
import { useAuthTheme } from '../auth/auth-theme';
import { notifyValidationError } from '@/lib/validation-feedback';

type Props<T extends FieldValues> = Omit<
  UniversalTextInputProps,
  'value' | 'defaultValue' | 'ref' | 'onChangeText' | 'onBlur' | 'status' | 'onPress'
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
): Partial<UniversalTextInputProps> {
  if (!password) return {};
  const secureTextEntry = !shown;
  if (toggle === 'button') return { secureTextEntry };
  return {
    secureTextEntry,
    rightIcon: shown ? authInputIcons.hidePassword : authInputIcons.showPassword,
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
  const nativeValue = useNativeState(value);
  const [showPassword, setShowPassword] = useState(false);
  const { colors } = useAuthTheme();
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

  useEffect(() => {
    // Keep external form resets in sync without remounting the native input.
    if (nativeValue.get() !== value) nativeValue.set(value);
  }, [nativeValue, value]);

  return (
    <Column spacing={8} modifiers={nativeFillWidth}>
      <UniversalTextInputContent
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
        value={nativeValue}
        palette={colors}
        onBlur={() => field.onBlur()}
        onChangeText={(text) => {
          field.onChange(text);
          onEdited?.();
        }}
        status={invalid ? 'error' : 'default'}
      />
      {message ? (
        <AuthText
          testID={testID ? `${testID}-${messageSuffix}` : undefined}
          modifiers={nativeFillWidth}
          textStyle={{ color: invalid ? colors.error : colors.muted, fontSize: 14, lineHeight: 20 }}
        >
          {message}
        </AuthText>
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
