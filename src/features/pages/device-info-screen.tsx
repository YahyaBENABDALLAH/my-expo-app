import { useTranslation } from 'react-i18next';
import { PageScreen, PageSection, UniversalTextContent } from '@components/ui';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

export function DeviceInfoScreen() {
  const { t } = useTranslation();
  return (
    <PageScreen title={t('tools.deviceInfo')} description={t('tools.deviceDescription')}>
      <PageSection>
        <UniversalTextContent>
          {t('tools.model', { model: Device.modelName ?? t('common.unknown') })}
        </UniversalTextContent>
        <UniversalTextContent>
          {t('tools.system', {
            name: Device.osName ?? t('common.unknown'),
            version: Device.osVersion ?? '',
          })}
        </UniversalTextContent>
        <UniversalTextContent>
          {t('tools.version', { version: Constants.expoConfig?.version ?? t('common.unknown') })}
        </UniversalTextContent>
      </PageSection>
    </PageScreen>
  );
}
