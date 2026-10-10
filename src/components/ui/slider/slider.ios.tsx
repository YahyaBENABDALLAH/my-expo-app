import { useThemeColors } from '@/hooks/use-theme';
import { Slider as NativeSlider, type SliderProps } from '@expo/ui';
import { tint } from '@expo/ui/swift-ui/modifiers';
import { useHostColorScheme } from '../host/universal-host';

export function Slider({ disabled, onValueChange, modifiers, ...props }: SliderProps) {
  const colors = useThemeColors(useHostColorScheme());
  return (
    <NativeSlider
      {...props}
      disabled={disabled}
      onValueChange={(value) => {
        if (!disabled) onValueChange(value);
      }}
      modifiers={[tint(colors.controlActive), ...(modifiers ?? [])]}
    />
  );
}
