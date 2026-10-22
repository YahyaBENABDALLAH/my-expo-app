import { useTranslation } from 'react-i18next';
import { Picker, Text } from '@expo/ui/swift-ui';
import { pickerStyle, tag } from '@expo/ui/swift-ui/modifiers';
import type { SegmentedControlProps } from './segmented-control';

export function SegmentedControl({
  options,
  selectedValue,
  onValueChange,
  label,
}: SegmentedControlProps) {
  const { t } = useTranslation();
  return (
    <Picker
      label={label ?? t('common.options')}
      selection={selectedValue}
      onSelectionChange={(value) => {
        if (value !== null) onValueChange(value);
      }}
      modifiers={[pickerStyle('segmented')]}
    >
      {options.map((option) => (
        <Text key={option.value} testID={option.testID} modifiers={[tag(option.value)]}>
          {option.label}
        </Text>
      ))}
    </Picker>
  );
}
