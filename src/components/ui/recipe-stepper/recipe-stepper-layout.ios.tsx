import { RNHostView } from '@expo/ui';
import { HStack, VStack, ZStack } from '@expo/ui/swift-ui';
import {
  accessibilityElement,
  accessibilityLabel,
  frame,
  onGeometryChange,
} from '@expo/ui/swift-ui/modifiers';
import { useMeasuredWidth } from '@/hooks/use-measured-width';
import type { RecipeStepperLayoutProps } from './recipe-stepper-layout.types';

export function RecipeStepperLayout({ artwork, steps, indicatorHeight }: RecipeStepperLayoutProps) {
  const [width, setWidth] = useMeasuredWidth();
  return (
    <ZStack alignment="top" modifiers={[frame({ minWidth: 0, maxWidth: Infinity })]}>
      {width > 0 && <RNHostView matchContents>{artwork(width)}</RNHostView>}
      <HStack
        alignment="top"
        spacing={0}
        modifiers={[
          frame({ minWidth: 0, maxWidth: Infinity }),
          onGeometryChange((layout) => setWidth(layout.width)),
        ]}
      >
        {steps.map((step) => (
          <VStack
            key={step.id}
            spacing={0}
            testID={step.id}
            modifiers={[
              frame({ maxWidth: Infinity }),
              accessibilityElement('ignore'),
              accessibilityLabel(step.accessibilityLabel),
            ]}
          >
            <ZStack modifiers={[frame({ maxWidth: Infinity, height: indicatorHeight })]}>
              {step.number}
            </ZStack>
            {step.label}
          </VStack>
        ))}
      </HStack>
    </ZStack>
  );
}
