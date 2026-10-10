import { useNativeState } from '@expo/ui';
import { useEffect } from 'react';
import { UniversalTextInputContent } from '../text-input/universal-text-input';

export function NativeField({
  label,
  value,
  onChange,
  testID,
  numeric = false,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  testID: string;
  numeric?: boolean;
  multiline?: boolean;
}) {
  const nativeValue = useNativeState(value);
  useEffect(() => {
    nativeValue.set(value);
  }, [nativeValue, value]);
  return (
    <UniversalTextInputContent
      label={label}
      testID={testID}
      value={nativeValue}
      onChangeText={onChange}
      keyboardType={numeric ? 'decimal-pad' : 'default'}
      multiline={multiline}
    />
  );
}
