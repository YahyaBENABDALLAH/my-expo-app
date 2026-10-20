import { useTranslation } from 'react-i18next';
import {
  PageScreen,
  PageSection,
  SegmentedControl,
  UniversalTextContent as Text,
} from '@components/ui';
import { useState } from 'react';

export default function SegmentsScreen() {
  const { t } = useTranslation();
  const [value, setValue] = useState('recipes');
  return (
    <PageScreen title={t('showcase.segments')} description={t('showcase.segmentsDescription')}>
      <PageSection>
        <SegmentedControl
          label={t('showcase.view')}
          selectedValue={value}
          onValueChange={setValue}
          options={[
            { value: 'recipes', label: t('common.recipes'), testID: 'demo-segment-recipes' },
            { value: 'saved', label: t('showcase.saved'), testID: 'demo-segment-saved' },
          ]}
        />
        <Text testID="demo-segment-value">
          {t('common.selectedValue', {
            value: t(value === 'saved' ? 'showcase.saved' : 'common.recipes'),
          })}
        </Text>
      </PageSection>
    </PageScreen>
  );
}
