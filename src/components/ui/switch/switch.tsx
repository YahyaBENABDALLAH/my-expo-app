import { Switch as NativeSwitch } from '@expo/ui';
import type { SwitchProps } from './switch.types';

/** Native appearance and glass feedback come from the owning Host and OS. */
export function Switch({ disabled, onValueChange, ...props }: SwitchProps) {
  return (
    <NativeSwitch
      {...props}
      disabled={disabled}
      onValueChange={(value) => {
        if (!disabled) onValueChange(value);
      }}
    />
  );
}
