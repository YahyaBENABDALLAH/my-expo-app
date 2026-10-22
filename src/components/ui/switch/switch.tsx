import { Switch as NativeSwitch, type SwitchProps } from '@expo/ui';

export type { SwitchProps } from '@expo/ui';

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
