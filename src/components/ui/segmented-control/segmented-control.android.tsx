import { SegmentedButton, SingleChoiceSegmentedButtonRow, Text } from '@expo/ui/jetpack-compose';
import { fillMaxWidth, testID } from '@expo/ui/jetpack-compose/modifiers';
import type { SegmentedControlProps } from './segmented-control';

export function SegmentedControl({ options, selectedValue, onValueChange }: SegmentedControlProps) {
  return (
    <SingleChoiceSegmentedButtonRow modifiers={[fillMaxWidth()]}>
      {options.map((option) => (
        <SegmentedButton
          key={option.value}
          selected={selectedValue === option.value}
          onClick={() => onValueChange(option.value)}
          modifiers={[testID(option.testID)]}
        >
          <SegmentedButton.Label>
            <Text>{option.label}</Text>
          </SegmentedButton.Label>
        </SegmentedButton>
      ))}
    </SingleChoiceSegmentedButtonRow>
  );
}
