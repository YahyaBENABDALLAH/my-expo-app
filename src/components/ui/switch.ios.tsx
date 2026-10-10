import { useThemeColors } from '@/hooks/use-theme';
import { Switch as NativeSwitch } from '@expo/ui';
import { foregroundStyle, tint } from '@expo/ui/swift-ui/modifiers';
import { useHostColorScheme } from './universal-host';
import type { SwitchProps } from './switch.types';

export function Switch({ disabled, onValueChange, modifiers, ...props }: SwitchProps) {
  const colors = useThemeColors(useHostColorScheme());
  return (
    <NativeSwitch
      {...props}
      disabled={disabled}
      onValueChange={(value) => {
        if (!disabled) onValueChange(value);
      }}
      modifiers={[
        tint(colors.switchTrackOn),
        foregroundStyle(disabled ? colors.muted : colors.text),
        ...(modifiers ?? []),
      ]}
    />
  );
}
