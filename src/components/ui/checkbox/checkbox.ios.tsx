import { useThemeColors } from '@/hooks/use-theme';
import { Checkbox as NativeCheckbox, type CheckboxProps } from '@expo/ui';
import { foregroundStyle, tint } from '@expo/ui/swift-ui/modifiers';
import { useHostColorScheme } from '../host/universal-host';

export function Checkbox({ disabled, onValueChange, modifiers, ...props }: CheckboxProps) {
  const colors = useThemeColors(useHostColorScheme());
  return (
    <NativeCheckbox
      {...props}
      disabled={disabled}
      onValueChange={(value) => {
        if (!disabled) onValueChange(value);
      }}
      modifiers={[
        tint(colors.controlActive),
        foregroundStyle(disabled ? colors.controlDisabledContent : colors.text),
        ...(modifiers ?? []),
      ]}
    />
  );
}
