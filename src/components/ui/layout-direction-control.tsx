import { useTranslation } from 'react-i18next';
import { Column } from '@expo/ui';
import { useLayoutDirectionSettings } from '@/context/layout-direction.context';
import { Switch } from './switch';
import { UniversalTextContent as Text } from './universal-text';

export function LayoutDirectionControl({
  compact = false,
  testIDPrefix = 'layout-direction',
}: {
  compact?: boolean;
  testIDPrefix?: string;
}) {
  const { t } = useTranslation();
  const { direction, setDirection } = useLayoutDirectionSettings();
  const control = (
    <Switch
      label={compact ? t('appearance.rtl') : t('appearance.rtlLayout')}
      testID={`${testIDPrefix}-switch`}
      value={direction === 'rtl'}
      onValueChange={(enabled) => setDirection(enabled ? 'rtl' : 'ltr')}
    />
  );
  if (compact) return control;
  return (
    <Column spacing={8}>
      <Text>{t('appearance.direction')}</Text>
      {control}
    </Column>
  );
}
