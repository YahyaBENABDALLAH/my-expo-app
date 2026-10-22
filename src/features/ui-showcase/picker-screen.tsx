import { useTranslation } from 'react-i18next';
import {
  PageScreen,
  Picker,
  UniversalButtonContent,
  UniversalTextContent as Text,
} from '@components/ui';
import { useState } from 'react';
import { DemoSection } from './demo-section';

const options = [
  { value: 'recipes', label: 'common.recipes' },
  { value: 'favorites', label: 'common.favoritesOnly' },
  { value: 'history', label: 'common.recipeHistory' },
] as const;

export default function PickerScreen() {
  const { t } = useTranslation();
  const [value, setValue] = useState('recipes');
  const [servings, setServings] = useState(2);
  const [blockedChanges, setBlockedChanges] = useState(0);
  return (
    <PageScreen title={t('showcase.picker')} description={t('showcase.pickerDescription')}>
      <DemoSection title={t('showcase.gallery.menu')}>
        <Picker selectedValue={value} onValueChange={setValue} testID="demo-picker">
          {options.map((option) => (
            <Picker.Item key={option.value} label={t(option.label)} value={option.value} />
          ))}
        </Picker>
        <Text testID="demo-picker-value">
          {t('common.selectedValue', {
            value: t(options.find((option) => option.value === value)?.label ?? 'common.none'),
          })}
        </Text>
      </DemoSection>
      <DemoSection
        title={t('showcase.gallery.numericPicker')}
        hint={t('showcase.gallery.wheelHint')}
      >
        <Picker
          selectedValue={servings}
          onValueChange={setServings}
          appearance="wheel"
          testID="demo-picker-numeric"
        >
          {[1, 2, 4].map((quantity) => (
            <Picker.Item
              key={quantity}
              label={t('showcase.gallery.servings', { value: quantity })}
              value={quantity}
            />
          ))}
        </Picker>
        <Text testID="demo-picker-numeric-value">
          {t('showcase.gallery.servings', { value: servings })}
        </Text>
        <UniversalButtonContent
          variant="secondary"
          label={t('showcase.gallery.reset')}
          onPress={() => {
            setValue('recipes');
            setServings(2);
            setBlockedChanges(0);
          }}
          testID="demo-picker-reset"
        />
      </DemoSection>
      <DemoSection title={t('showcase.disabledPicker')} hint={t('showcase.gallery.disabledHint')}>
        <Picker
          selectedValue={value}
          onValueChange={() => setBlockedChanges((current) => current + 1)}
          enabled={false}
          testID="demo-picker-disabled"
        >
          {options.map((option) => (
            <Picker.Item key={option.value} label={t(option.label)} value={option.value} />
          ))}
        </Picker>
        <Text testID="demo-picker-disabled-changes">
          {t('showcase.gallery.changes', { total: blockedChanges })}
        </Text>
      </DemoSection>
    </PageScreen>
  );
}
