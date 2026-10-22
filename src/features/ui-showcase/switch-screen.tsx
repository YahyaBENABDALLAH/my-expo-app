import { useTranslation } from 'react-i18next';
import {
  PageScreen,
  Switch,
  UniversalButtonContent,
  UniversalTextContent as Text,
} from '@components/ui';
import { useState } from 'react';
import { DemoSection } from './demo-section';

export default function SwitchScreen() {
  const { t } = useTranslation();
  const [enabled, setEnabled] = useState(false);
  const [weekly, setWeekly] = useState(true);
  const [changes, setChanges] = useState(0);
  return (
    <PageScreen title={t('showcase.switch')} description={t('showcase.switchDescription')}>
      <DemoSection title={t('showcase.gallery.interaction')} hint={t('showcase.gallery.localOnly')}>
        <Switch
          label={t('showcase.notifications')}
          value={enabled}
          onValueChange={(value) => {
            setEnabled(value);
            setChanges((current) => current + 1);
          }}
          testID="demo-switch"
        />
        <Text testID="demo-switch-state">
          {enabled ? t('showcase.notificationsOn') : t('showcase.notificationsOff')}
        </Text>
        <Switch
          label={t('showcase.gallery.weekly')}
          value={weekly}
          onValueChange={(value) => {
            setWeekly(value);
            setChanges((current) => current + 1);
          }}
          testID="demo-switch-weekly"
        />
        <Text testID="demo-switch-changes">
          {t('showcase.gallery.changes', { total: changes })}
        </Text>
        <UniversalButtonContent
          variant="secondary"
          label={t('showcase.gallery.reset')}
          onPress={() => {
            setEnabled(false);
            setWeekly(true);
            setChanges(0);
          }}
          testID="demo-switch-reset"
        />
      </DemoSection>
      <DemoSection title={t('showcase.gallery.disabled')} hint={t('showcase.gallery.disabledHint')}>
        <Switch
          label={t('showcase.disabledOn')}
          value
          disabled
          onValueChange={() => setChanges((current) => current + 1)}
          testID="demo-switch-disabled-on"
        />
        <Switch
          label={t('showcase.disabledOff')}
          value={false}
          disabled
          onValueChange={() => setChanges((current) => current + 1)}
          testID="demo-switch-disabled-off"
        />
      </DemoSection>
    </PageScreen>
  );
}
