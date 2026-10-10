import { useThemeColors } from '@/hooks/use-theme';
import { Checkbox as NativeCheckbox, Row, Text } from '@expo/ui/jetpack-compose';
import { clickable, testID as nativeTestID } from '@expo/ui/jetpack-compose/modifiers';
import type { CheckboxProps } from '@expo/ui';
import { useHostColorScheme } from '../host/universal-host';

export function Checkbox({
  value,
  onValueChange,
  label,
  disabled,
  testID,
  modifiers,
}: CheckboxProps) {
  const colors = useThemeColors(useHostColorScheme());
  const checkbox = (
    <NativeCheckbox
      value={value}
      enabled={!disabled}
      onCheckedChange={disabled ? undefined : onValueChange}
      colors={{
        checkedColor: colors.controlActive,
        uncheckedColor: colors.muted,
        checkmarkColor: colors.controlOnActive,
        disabledCheckedColor: colors.controlDisabledActive,
        disabledUncheckedColor: colors.controlBorder,
        disabledIndeterminateColor: colors.controlDisabledActive,
      }}
      modifiers={[...(modifiers ?? []), ...(testID ? [nativeTestID(testID)] : [])]}
    />
  );
  if (label == null) return checkbox;
  return (
    <Row
      verticalAlignment="center"
      horizontalArrangement={{ spacedBy: 8 }}
      modifiers={disabled ? [] : [clickable(() => onValueChange(!value))]}
    >
      {checkbox}
      <Text color={disabled ? colors.controlDisabledContent : colors.text}>{label}</Text>
    </Row>
  );
}
