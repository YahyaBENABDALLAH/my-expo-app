import { useTranslation } from 'react-i18next';
import { PageScreen, PageSection, Picker, UniversalTextContent as Text } from '@components/ui';
import { useState } from 'react';

export default function PickerScreen() {
  const { t } = useTranslation();
  const [value, setValue] = useState('recipes');
  return (
    <PageScreen title={t('showcase.picker')} description={t('showcase.pickerDescription')}>
      <PageSection>
        <Picker selectedValue={value} onValueChange={setValue} testID="demo-picker">
          <Picker.Item label={t('common.recipes')} value="recipes" />
          <Picker.Item label={t('common.favoritesOnly')} value="favorites" />
          <Picker.Item label={t('common.recipeHistory')} value="history" />
        </Picker>
        <Text testID="demo-picker-value">
          {t('common.selectedValue', {
            value: t(
              {
                recipes: 'common.recipes',
                favorites: 'common.favoritesOnly',
                history: 'common.recipeHistory',
              }[value] ?? 'common.none',
            ),
          })}
        </Text>
        <Picker selectedValue={value} onValueChange={setValue} enabled={false}>
          <Picker.Item label={t('showcase.disabledPicker')} value={value} />
        </Picker>
      </PageSection>
    </PageScreen>
  );
}
