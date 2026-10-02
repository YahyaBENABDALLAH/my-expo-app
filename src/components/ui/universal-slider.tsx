import { Slider, type SliderProps } from '@expo/ui';
import { UniversalHost } from './universal-host';
import type { UniversalThemeProps } from './types';

export type UniversalSliderProps = SliderProps & UniversalThemeProps;

export function UniversalSlider({ colorScheme, seedColor, ...props }: UniversalSliderProps) {
  return (
    <UniversalHost
      testID={props.testID ? `${props.testID}-container` : undefined}
      colorScheme={colorScheme}
      seedColor={seedColor}
    >
      <Slider {...props} />
    </UniversalHost>
  );
}
