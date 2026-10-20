import { useTranslation } from 'react-i18next';
import { PageScreen, PageSection, TextInput, UniversalTextContent as Text } from '@components/ui';
import { useState } from 'react';

export default function InputScreen() {
  const { t } = useTranslation();
  const [draft, setDraft] = useState('');
  return (
    <PageScreen title={t('showcase.input')} description={t('showcase.inputDescription')}>
      <PageSection>
        <TextInput
          label={t('showcase.draft')}
          value={draft}
          onChangeText={setDraft}
          testID="demo-input"
        />
        <Text testID="demo-input-value">{t('showcase.draftValue', { value: draft })}</Text>
        <TextInput
          label={t('auth.email')}
          defaultValue="invalid-email"
          status="error"
          helperText={t('auth.invalidEmail')}
        />
        <TextInput
          label={t('showcase.disabledField')}
          defaultValue={t('showcase.readOnly')}
          disabled
        />
      </PageSection>
    </PageScreen>
  );
}
