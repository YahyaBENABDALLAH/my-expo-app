import { useTranslation } from 'react-i18next';
import { Collapsible, PageScreen, UniversalTextContent as Text } from '@components/ui';
import { useState } from 'react';

export default function CollapsibleScreen() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  return (
    <PageScreen
      title={t('showcase.collapsible')}
      description={t('showcase.collapsibleDescription')}
    >
      <Collapsible label={t('common.details')} isOpen={open} onOpenChange={setOpen}>
        <Text>{t('showcase.expanded')}</Text>
      </Collapsible>
    </PageScreen>
  );
}
