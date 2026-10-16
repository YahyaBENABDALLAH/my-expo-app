import { useTranslation } from 'react-i18next';
import { useThemeSettings, type ColorSchemePreference } from '@/context/theme.context';
import { Picker } from '../picker/picker';

export function ColorSchemeControl({
  testID = 'app-settings-color-scheme-picker',
}: {
  testID?: string;
}) {
  const { t } = useTranslation();
  const { colorScheme, setColorScheme } = useThemeSettings();
  return (
    <Picker<ColorSchemePreference>
      selectedValue={colorScheme}
      onValueChange={setColorScheme}
      appearance="menu"
      testID={testID}
    >
      <Picker.Item label={t('common.systemMode')} value="system" />
      <Picker.Item label={t('common.lightMode')} value="light" />
      <Picker.Item label={t('common.darkMode')} value="dark" />
    </Picker>
  );
}
