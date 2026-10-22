import { useTranslation } from 'react-i18next';
import {
  Checkbox,
  PageScreen,
  UniversalButtonContent,
  UniversalTextContent as Text,
} from '@components/ui';
import { useState } from 'react';
import { DemoSection } from './demo-section';

export default function CheckboxScreen() {
  const { t } = useTranslation();
  const [checked, setChecked] = useState(false);
  const [second, setSecond] = useState(true);
  const [changes, setChanges] = useState(0);
  return (
    <PageScreen title={t('showcase.checkbox')} description={t('showcase.checkboxDescription')}>
      <DemoSection title={t('showcase.gallery.interaction')} hint={t('showcase.gallery.localOnly')}>
        <Checkbox
          label={t('showcase.savePreference')}
          value={checked}
          onValueChange={(value) => {
            setChecked(value);
            setChanges((current) => current + 1);
          }}
          testID="demo-checkbox"
        />
        <Checkbox
          label={t('showcase.gallery.checkboxLongLabel')}
          value={second}
          onValueChange={(value) => {
            setSecond(value);
            setChanges((current) => current + 1);
          }}
          testID="demo-checkbox-long-label"
        />
        <Text testID="demo-checkbox-value">
          {t(checked ? 'showcase.gallery.checked' : 'showcase.gallery.unchecked')}
        </Text>
        <Text testID="demo-checkbox-changes">
          {t('showcase.gallery.changes', { total: changes })}
        </Text>
        <UniversalButtonContent
          variant="secondary"
          label={t('showcase.gallery.reset')}
          onPress={() => {
            setChecked(false);
            setSecond(true);
            setChanges(0);
          }}
          testID="demo-checkbox-reset"
        />
      </DemoSection>
      <DemoSection title={t('showcase.gallery.disabled')} hint={t('showcase.gallery.disabledHint')}>
        <Checkbox
          label={t('showcase.disabledSelected')}
          value
          disabled
          onValueChange={() => setChanges((current) => current + 1)}
          testID="demo-checkbox-disabled-on"
        />
        <Checkbox
          label={t('showcase.disabledUnselected')}
          value={false}
          disabled
          onValueChange={() => setChanges((current) => current + 1)}
          testID="demo-checkbox-disabled-off"
        />
      </DemoSection>
    </PageScreen>
  );
}
