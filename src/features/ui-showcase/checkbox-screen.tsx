import { useTranslation } from 'react-i18next';
import { Checkbox, PageScreen } from '@components/ui';
import { useState } from 'react';

export default function CheckboxScreen() {
  const { t } = useTranslation();
  const [checked, setChecked] = useState(false);
  return (
    <PageScreen title={t('showcase.checkbox')} description={t('showcase.checkboxDescription')}>
      <Checkbox
        label={t('showcase.savePreference')}
        value={checked}
        onValueChange={setChecked}
        testID="demo-checkbox"
      />
      <Checkbox label={t('showcase.disabledSelected')} value disabled onValueChange={() => {}} />
      <Checkbox
        label={t('showcase.disabledUnselected')}
        value={false}
        disabled
        onValueChange={() => {}}
      />
    </PageScreen>
  );
}
