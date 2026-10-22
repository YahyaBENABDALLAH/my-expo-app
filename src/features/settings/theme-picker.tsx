import { themeIds, themes, type ThemeId } from '@/constants/themes/index';
import { useThemeSettings } from '@/context/theme.context';
import { Picker } from '@components/ui';

export function ThemePicker() {
  const { themeId, setThemeId } = useThemeSettings();
  return (
    <Picker<ThemeId>
      selectedValue={themeId}
      onValueChange={setThemeId}
      appearance="menu"
      testID="app-settings-theme-picker"
    >
      {themeIds.map((id) => (
        <Picker.Item key={id} label={themes[id].label} value={id} />
      ))}
    </Picker>
  );
}
