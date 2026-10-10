import { themeIds, themes, type ThemeId } from '@/constants/themes/index';
import { useThemeSettings } from '@/context/theme.context';
import { Picker } from './picker';

export function ThemePicker() {
  const { themeId, setThemeId } = useThemeSettings();
  return (
    <Picker<ThemeId>
      selectedValue={themeId}
      onValueChange={setThemeId}
      appearance="menu"
      testID="page-theme-picker"
    >
      {themeIds.map((id) => (
        <Picker.Item key={id} label={themes[id].label} value={id} />
      ))}
    </Picker>
  );
}
