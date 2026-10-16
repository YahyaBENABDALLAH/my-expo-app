import { HorizontalPager, type HorizontalPagerHandle } from '@expo/ui/jetpack-compose';
import { useEffect, useRef } from 'react';
import { nativeFillSize } from '../native/native-fill-width';
import type { OnboardingPagerProps } from './types';

export function OnboardingPager({
  step,
  onStepChange,
  disabled,
  reducedMotion,
  children,
}: OnboardingPagerProps) {
  const pager = useRef<HorizontalPagerHandle>(null);
  const selected = useRef(step);

  useEffect(() => {
    if (selected.current === step) return;
    selected.current = step;
    if (reducedMotion) void pager.current?.scrollToPage(step);
    else void pager.current?.animateScrollToPage(step);
  }, [step, reducedMotion]);

  return (
    <HorizontalPager
      ref={pager}
      initialPage={step}
      userScrollEnabled={!disabled}
      modifiers={nativeFillSize}
      onSettledPageChange={(page) => {
        selected.current = page;
        onStepChange(page);
      }}
    >
      {children}
    </HorizontalPager>
  );
}
