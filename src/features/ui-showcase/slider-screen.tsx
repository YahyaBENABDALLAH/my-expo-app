import { useTranslation } from 'react-i18next';
import {
  PageScreen,
  Slider,
  UniversalButtonContent,
  UniversalTextContent as Text,
  nativeFillWidth,
} from '@components/ui';
import { useState } from 'react';
import { DemoSection } from './demo-section';

export default function SliderScreen() {
  const { t } = useTranslation();
  const [amount, setAmount] = useState(40);
  const [continuous, setContinuous] = useState(0.35);
  const [blockedChanges, setBlockedChanges] = useState(0);
  return (
    <PageScreen title={t('showcase.slider')} description={t('showcase.sliderDescription')}>
      <DemoSection title={t('showcase.gallery.stepped')} hint={t('showcase.gallery.steppedHint')}>
        <Text testID="demo-slider-value">{t('showcase.amount', { amount })}</Text>
        <Slider
          min={0}
          max={100}
          step={10}
          value={amount}
          onValueChange={setAmount}
          testID="demo-slider"
          modifiers={nativeFillWidth}
        />
      </DemoSection>
      <DemoSection title={t('showcase.gallery.continuous')}>
        <Text testID="demo-slider-continuous-value">
          {t('showcase.gallery.percent', { value: Math.round(continuous * 100) })}
        </Text>
        <Slider
          min={0}
          max={1}
          value={continuous}
          onValueChange={setContinuous}
          modifiers={nativeFillWidth}
          testID="demo-slider-continuous"
        />
        <UniversalButtonContent
          variant="secondary"
          label={t('showcase.gallery.reset')}
          onPress={() => {
            setAmount(40);
            setContinuous(0.35);
            setBlockedChanges(0);
          }}
          testID="demo-slider-reset"
        />
      </DemoSection>
      <DemoSection title={t('showcase.gallery.disabled')} hint={t('showcase.gallery.disabledHint')}>
        <Slider
          min={0}
          max={100}
          value={60}
          disabled
          onValueChange={() => setBlockedChanges((current) => current + 1)}
          modifiers={nativeFillWidth}
          testID="demo-slider-disabled"
        />
        <Text testID="demo-slider-disabled-changes">
          {t('showcase.gallery.changes', { total: blockedChanges })}
        </Text>
      </DemoSection>
    </PageScreen>
  );
}
