import { Slider as NativeSlider, type SliderProps } from '@expo/ui';

export function Slider({ disabled, onValueChange, ...props }: SliderProps) {
  return (
    <NativeSlider
      {...props}
      disabled={disabled}
      onValueChange={(value) => {
        if (!disabled) onValueChange(value);
      }}
    />
  );
}

export type { SliderProps } from '@expo/ui';
