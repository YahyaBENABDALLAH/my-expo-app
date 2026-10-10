import { RNHostView } from '@expo/ui';
import { Box, Column, Row } from '@expo/ui/jetpack-compose';
import {
  fillMaxWidth,
  height,
  onSizeChanged,
  semantics,
  testID,
  weight,
} from '@expo/ui/jetpack-compose/modifiers';
import { useState } from 'react';
import type { RecipeStepperLayoutProps } from './recipe-stepper-layout.types';

export function RecipeStepperLayout({ artwork, steps, indicatorHeight }: RecipeStepperLayoutProps) {
  const [width, setWidth] = useState(0);
  return (
    <Box contentAlignment="topStart" modifiers={[fillMaxWidth()]}>
      {width > 0 && (
        <RNHostView matchContents modifiers={[height(indicatorHeight)]}>
          {artwork(width)}
        </RNHostView>
      )}
      <Row
        verticalAlignment="top"
        modifiers={[fillMaxWidth(), onSizeChanged((size) => setWidth(size.width))]}
      >
        {steps.map((step) => (
          <Column
            key={step.id}
            horizontalAlignment="center"
            modifiers={[
              weight(1),
              testID(step.id),
              semantics({ contentDescription: step.accessibilityLabel }),
            ]}
          >
            <Box contentAlignment="center" modifiers={[fillMaxWidth(), height(indicatorHeight)]}>
              {step.number}
            </Box>
            {step.label}
          </Column>
        ))}
      </Row>
    </Box>
  );
}
