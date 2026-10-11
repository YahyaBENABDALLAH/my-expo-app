import {
  LanguagePicker,
  NativeField,
  PageScreen,
  UniversalTextContent as Text,
} from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/context/language.context';
import { useLayoutDirection } from '@/context/layout-direction.context';

function LocalizationPreview() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const direction = useLayoutDirection();
  const [draft, setDraft] = useState('');
  return (
    <PageScreen title={t('common.account')} description={t('profile.description')}>
      <Text testID="locale-status">{`${language} · ${direction}`}</Text>
      <NativeField
        label={t('showcase.draft')}
        value={draft}
        onChange={setDraft}
        testID="locale-draft"
      />
      <Text testID="locale-draft-value">{t('showcase.draftValue', { value: draft })}</Text>
      <LanguagePicker />
    </PageScreen>
  );
}

// Uses the app's actual provider and profile language picker. The flow selects its starting locale.
const meta = {
  title: 'Pages/Localization',
  component: LocalizationPreview,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof LocalizationPreview>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
