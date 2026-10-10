import { useThemeColors } from '@/hooks/use-theme';
import { SegmentedButton, SingleChoiceSegmentedButtonRow, Text } from '@expo/ui/jetpack-compose';
import { fillMaxWidth, testID } from '@expo/ui/jetpack-compose/modifiers';
import type { SegmentedControlProps } from './segmented-control.types';
import { useHostColorScheme } from '../host/universal-host';

export function SegmentedControl({ options, selectedValue, onValueChange }: SegmentedControlProps) {
  const colors = useThemeColors(useHostColorScheme());
  return (
    <SingleChoiceSegmentedButtonRow modifiers={[fillMaxWidth()]}>
      {options.map((option) => (
        <SegmentedButton
          key={option.value}
          selected={selectedValue === option.value}
          colors={{
            activeContainerColor: colors.controlSelected,
            activeContentColor: colors.controlOnSelected,
            activeBorderColor: colors.controlBorder,
            inactiveContainerColor: colors.controlSurface,
            inactiveContentColor: colors.text,
            inactiveBorderColor: colors.controlBorder,
            disabledActiveContainerColor: colors.controlDisabledSurface,
            disabledActiveContentColor: colors.controlDisabledContent,
            disabledActiveBorderColor: colors.controlBorder,
            disabledInactiveContainerColor: colors.controlDisabledSurface,
            disabledInactiveContentColor: colors.controlDisabledContent,
            disabledInactiveBorderColor: colors.controlBorder,
          }}
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
