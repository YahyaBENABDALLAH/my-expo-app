import { useTranslation } from 'react-i18next';
import { HEADER_SHAPES, type PageHeaderShape } from '@/constants/header-motion';
import { useThemeSettings } from '@/context/theme.context';
import { Picker } from '@components/ui';

export function HeaderMotionPicker() {
  const { t } = useTranslation();
  const { headerShape, setHeaderShape, headerMotionReady } = useThemeSettings();
  return (
    <Picker<PageHeaderShape>
      selectedValue={headerShape}
      onValueChange={setHeaderShape}
      enabled={headerMotionReady}
      appearance="menu"
      testID="app-settings-header-motion-picker"
    >
      {HEADER_SHAPES.map((shape) => (
        <Picker.Item key={shape} label={t(`settings.headerShapes.${shape}`)} value={shape} />
      ))}
    </Picker>
  );
}
