import { useTranslation } from 'react-i18next';
import { PageScreen, Slider, UniversalTextContent as Text } from '@components/ui';
import { useState } from 'react';

export default function SliderScreen() {
  const { t } = useTranslation();
  const [amount, setAmount] = useState(40);
  return (
    <PageScreen title={t('showcase.slider')} description={t('showcase.sliderDescription')}>
      <Text testID="demo-slider-value">{t('showcase.amount', { amount })}</Text>
      <Slider
        min={0}
        max={100}
        step={10}
        value={amount}
        onValueChange={setAmount}
        testID="demo-slider"
      />
      <Slider min={0} max={100} value={60} disabled onValueChange={() => {}} />
    </PageScreen>
  );
}
