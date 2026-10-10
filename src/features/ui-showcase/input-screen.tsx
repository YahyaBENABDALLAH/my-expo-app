import { useTranslation } from 'react-i18next';
import {
  PageScreen,
  UniversalTextInputContent,
  UniversalTextContent as Text,
} from '@components/ui';
import { useState } from 'react';

export default function InputScreen() {
  const { t } = useTranslation();
  const [draft, setDraft] = useState('');
  return (
    <PageScreen title={t('showcase.input')} description={t('showcase.inputDescription')}>
      <UniversalTextInputContent
        label={t('showcase.draft')}
        onChangeText={setDraft}
        testID="demo-input"
      />
      <Text testID="demo-input-value">{t('showcase.draftValue', { value: draft })}</Text>
      <UniversalTextInputContent
        label={t('auth.email')}
        defaultValue="invalid-email"
        status="error"
        helperText={t('auth.invalidEmail')}
      />
      <UniversalTextInputContent
        label={t('showcase.disabledField')}
        defaultValue={t('showcase.readOnly')}
        disabled
      />
    </PageScreen>
  );
}
