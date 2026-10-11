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
import { useMeasuredWidth } from '@/hooks/use-measured-width';
import type { RecipeStepperLayoutProps } from './recipe-stepper-layout.types';

export function RecipeStepperLayout({
  renderArtwork,
  steps,
  indicatorHeight,
}: RecipeStepperLayoutProps) {
  const [width, setWidth] = useMeasuredWidth();
  return (
    <Box contentAlignment="topStart" modifiers={[fillMaxWidth()]}>
      {width > 0 && (
        <RNHostView matchContents modifiers={[height(indicatorHeight)]}>
          {renderArtwork(width)}
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
