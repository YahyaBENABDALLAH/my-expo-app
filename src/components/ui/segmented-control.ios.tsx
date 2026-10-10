import { useTranslation } from 'react-i18next';
import { useThemeColors } from '@/hooks/use-theme';
import { Picker, Text } from '@expo/ui/swift-ui';
import { foregroundStyle, pickerStyle, tag, tint } from '@expo/ui/swift-ui/modifiers';
import type { SegmentedControlProps } from './segmented-control.types';
import { useHostColorScheme } from './universal-host';

export function SegmentedControl({
  options,
  selectedValue,
  onValueChange,
  label,
}: SegmentedControlProps) {
  const { t } = useTranslation();
  const colors = useThemeColors(useHostColorScheme());
  return (
    <Picker
      label={label ?? t('common.options')}
      selection={selectedValue}
      onSelectionChange={(value) => {
        if (value !== null) onValueChange(value);
      }}
      modifiers={[
        pickerStyle('segmented'),
        tint(colors.controlActive),
        foregroundStyle(colors.text),
      ]}
    >
      {options.map((option) => (
        <Text key={option.value} testID={option.testID} modifiers={[tag(option.value)]}>
          {option.label}
        </Text>
      ))}
    </Picker>
  );
}
