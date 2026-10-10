import { useThemeColors } from '@/hooks/use-theme';
import { Slider as NativeSlider } from '@expo/ui/jetpack-compose';
import { testID as nativeTestID } from '@expo/ui/jetpack-compose/modifiers';
import type { SliderProps } from '@expo/ui';
import { useHostColorScheme } from '../host/universal-host';

export function Slider({
  value,
  onValueChange,
  min = 0,
  max = 1,
  step,
  disabled,
  testID,
  modifiers,
}: SliderProps) {
  const colors = useThemeColors(useHostColorScheme());
  const stepped = step != null && step > 0;
  return (
    <NativeSlider
      value={value}
      min={min}
      max={max}
      enabled={!disabled}
      steps={stepped ? Math.max(0, Math.round((max - min) / step) - 1) : undefined}
      onValueChange={
        disabled
          ? undefined
          : (next) => onValueChange(stepped ? Math.round((next - min) / step) * step + min : next)
      }
      colors={{
        thumbColor: colors.controlActive,
        activeTrackColor: colors.controlActive,
        inactiveTrackColor: colors.controlTrack,
        activeTickColor: colors.controlOnActive,
        inactiveTickColor: colors.muted,
      }}
      modifiers={[...(modifiers ?? []), ...(testID ? [nativeTestID(testID)] : [])]}
    />
  );
}
