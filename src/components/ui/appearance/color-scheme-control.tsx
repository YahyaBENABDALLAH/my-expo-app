import { useTranslation } from 'react-i18next';
import { useThemeSettings } from '@/context/theme.context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Switch } from '../switch/switch';

export function ColorSchemeControl() {
  const { t } = useTranslation();
  const { setColorScheme } = useThemeSettings();
  const scheme = useColorScheme();
  return (
    <Switch
      label={t('common.darkMode')}
      testID="app-settings-color-scheme-switch"
      value={scheme === 'dark'}
      onValueChange={(dark) => setColorScheme(dark ? 'dark' : 'light')}
    />
  );
}
