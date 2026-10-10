import { useThemeColors } from '@/hooks/use-theme';
import { Row, Switch as NativeSwitch, Text } from '@expo/ui/jetpack-compose';
import { testID as nativeTestID, weight } from '@expo/ui/jetpack-compose/modifiers';
import { useHostColorScheme } from './universal-host';
import type { SwitchProps } from './switch.types';

export function Switch({ value, onValueChange, label, disabled, testID, modifiers }: SwitchProps) {
  const colors = useThemeColors(useHostColorScheme());
  const toggle = (
    <NativeSwitch
      value={value}
      onCheckedChange={disabled ? undefined : onValueChange}
      enabled={!disabled}
      colors={{
        checkedTrackColor: colors.switchTrackOn,
        checkedThumbColor: colors.switchThumbOn,
        checkedBorderColor: colors.switchTrackOn,
        checkedIconColor: colors.switchTrackOn,
        uncheckedTrackColor: colors.switchTrackOff,
        uncheckedThumbColor: colors.switchThumbOff,
        uncheckedBorderColor: colors.switchBorderOff,
        uncheckedIconColor: colors.switchTrackOff,
        disabledCheckedTrackColor: colors.switchTrackDisabledOn,
        disabledCheckedThumbColor: colors.switchThumbDisabledOn,
        disabledCheckedBorderColor: colors.switchTrackDisabledOn,
        disabledCheckedIconColor: colors.switchTrackDisabledOn,
        disabledUncheckedTrackColor: colors.switchTrackDisabledOff,
        disabledUncheckedThumbColor: colors.switchThumbDisabledOff,
        disabledUncheckedBorderColor: colors.switchBorderDisabledOff,
        disabledUncheckedIconColor: colors.switchTrackDisabledOff,
      }}
      modifiers={[...(modifiers ?? []), ...(testID ? [nativeTestID(testID)] : [])]}
    />
  );

  if (label == null) return toggle;
  return (
    <Row verticalAlignment="center" horizontalArrangement={{ spacedBy: 8 }}>
      <Text color={disabled ? colors.muted : colors.text} modifiers={[weight(1)]}>
        {label}
      </Text>
      {toggle}
    </Row>
  );
}
