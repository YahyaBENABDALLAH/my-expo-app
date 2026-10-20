import { useTranslation } from 'react-i18next';
import { PageScreen, PageSection, Switch, UniversalTextContent as Text } from '@components/ui';
import { useState } from 'react';

export default function SwitchScreen() {
  const { t } = useTranslation();
  const [enabled, setEnabled] = useState(false);
  return (
    <PageScreen title={t('showcase.switch')} description={t('showcase.switchDescription')}>
      <PageSection>
        <Switch
          label={t('showcase.notifications')}
          value={enabled}
          onValueChange={setEnabled}
          testID="demo-switch"
        />
        <Text testID="demo-switch-state">
          {enabled ? t('showcase.notificationsOn') : t('showcase.notificationsOff')}
        </Text>
        <Switch label={t('showcase.disabledOn')} value disabled onValueChange={() => {}} />
        <Switch label={t('showcase.disabledOff')} value={false} disabled onValueChange={() => {}} />
      </PageSection>
    </PageScreen>
  );
}
