import type { ReactElement } from 'react';

export type OnboardingPagerProps = {
  step: number;
  onStepChange: (step: number) => void;
  disabled: boolean;
  reducedMotion: boolean;
  children: ReactElement[];
};
