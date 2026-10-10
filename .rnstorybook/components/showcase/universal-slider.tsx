import { Slider, type SliderProps, UniversalHost, type UniversalThemeProps } from '@components/ui';

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
