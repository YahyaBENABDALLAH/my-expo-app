import { useTranslation } from 'react-i18next';
import {
  ColorSchemeControl,
  Column,
  nativeFillWidth,
  PageScreen,
  ThemePicker,
  UniversalTextContent as Text,
} from '@components/ui';

export default function SettingsScreen() {
  const { t } = useTranslation();
  return (
    <PageScreen title={t('settings.title')} description={t('settings.description')}>
      <Column spacing={16} modifiers={nativeFillWidth} testID="app-settings-appearance">
        <Text variant="title">{t('common.theme')}</Text>
        <ThemePicker />
        <ColorSchemeControl />
      </Column>
    </PageScreen>
  );
}
