import type { ReactElement, ReactNode } from 'react';

export interface RecipeStepperLayoutProps {
  indicatorHeight: number;
  // RNHostView needs concrete child bounds when matching hosted canvas content.
  artwork: (width: number) => ReactElement;
  steps: {
    id: string;
    number: ReactNode;
    label: ReactNode;
    accessibilityLabel: string;
  }[];
}
