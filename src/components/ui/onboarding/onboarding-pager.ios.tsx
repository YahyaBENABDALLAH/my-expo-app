import { TabView } from '@expo/ui/swift-ui';
import { Animation, animation, disabled, tabViewStyle } from '@expo/ui/swift-ui/modifiers';
import { nativeFillSize } from '../native/native-fill-width';
import type { OnboardingPagerProps } from './types';

export function OnboardingPager({
  step,
  onStepChange,
  disabled: isDisabled,
  reducedMotion,
  children,
}: OnboardingPagerProps) {
  return (
    <TabView
      selection={String(step)}
      onSelectionChange={(value) => onStepChange(Number(value))}
      modifiers={[
        ...nativeFillSize,
        tabViewStyle({ type: 'page', indexDisplayMode: 'never' }),
        animation(Animation.easeInOut({ duration: reducedMotion ? 0 : 0.28 }), step),
        disabled(isDisabled),
      ]}
    >
      {children.map((child, index) => (
        <TabView.Tab key={child.key} value={String(index)}>
          {child}
        </TabView.Tab>
      ))}
    </TabView>
  );
}
