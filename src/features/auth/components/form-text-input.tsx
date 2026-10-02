import { useNativeState } from '@expo/ui';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { useController, type Control, type FieldPath, type FieldValues } from 'react-hook-form';

import { UniversalButton } from '@/components/ui/universal-button';
import {
  UniversalTextInput,
  type UniversalTextInputProps,
} from '@/components/ui/universal-text-input';
import Colors from '@/constants/colors';
import { useColorScheme } from '@/hooks/use-color-scheme';

type Props<T extends FieldValues> = Omit<
  UniversalTextInputProps,
  'value' | 'defaultValue' | 'ref' | 'onChangeText' | 'onBlur' | 'status'
> & {
  control: Control<T>;
  name: FieldPath<T>;
  password?: boolean;
  onEdited: () => void;
};

export function FormTextInput<T extends FieldValues>({
  control,
  name,
  password = false,
  onEdited,
  helperText,
  testID,
  ...props
}: Props<T>) {
  const { field, fieldState } = useController({ control, name });
  const value = typeof field.value === 'string' ? field.value : '';
  const nativeValue = useNativeState(value);
  const [showPassword, setShowPassword] = useState(false);
  const scheme = useColorScheme();

  useEffect(() => {
    // Keep external form resets in sync without remounting the native input.
    if (nativeValue.get() !== value) nativeValue.set(value);
  }, [nativeValue, value]);

  return (
    <View style={{ gap: 8 }}>
      <UniversalTextInput
        {...props}
        testID={testID}
        ref={(input) => field.ref(input)}
        value={nativeValue}
        colorScheme={scheme}
        secureTextEntry={password && !showPassword}
        onBlur={() => field.onBlur()}
        onChangeText={(text) => {
          field.onChange(text);
          onEdited();
        }}
        status={fieldState.error ? 'error' : 'default'}
        helperText={fieldState.error ? undefined : helperText}
      />
      {fieldState.error?.message ? (
        <Text
          testID={`${testID}-error`}
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
          selectable
          style={{ color: Colors[scheme].error, fontSize: 14, lineHeight: 20 }}
        >
          {fieldState.error.message}
        </Text>
      ) : null}
      {password ? (
        <View style={{ alignSelf: 'flex-end' }}>
          <UniversalButton
            testID={`${testID}-visibility`}
            variant="link"
            size="compact"
            colorScheme={scheme}
            label={showPassword ? 'Hide password' : 'Show password'}
            onPress={() => setShowPassword((shown) => !shown)}
          />
        </View>
      ) : null}
    </View>
  );
}
