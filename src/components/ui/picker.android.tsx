import { useThemeColors } from '@/hooks/use-theme';
import { Picker as UniversalPicker, type PickerProps, type PickerItemValue } from '@expo/ui';
import {
  DropdownMenuItem,
  ExposedDropdownMenu,
  ExposedDropdownMenuBox,
  Text,
  TextField,
  useNativeState,
} from '@expo/ui/jetpack-compose';
import { background, menuAnchor, testID as nativeTestID } from '@expo/ui/jetpack-compose/modifiers';
import { useEffect, useState } from 'react';
import { useHostColorScheme } from './universal-host';
import { pickerItems } from './picker-items';

export function Picker<T extends PickerItemValue>({
  selectedValue,
  onValueChange,
  enabled = true,
  children,
  testID,
}: PickerProps<T>) {
  const colors = useThemeColors(useHostColorScheme());
  const items = pickerItems<T>(children);
  const [expanded, setExpanded] = useState(false);
  const selectedLabel = items.find((item) => item.value === selectedValue)?.label ?? '';
  const labelState = useNativeState(selectedLabel);
  useEffect(() => {
    labelState.set(selectedLabel);
  }, [labelState, selectedLabel]);
  if (!enabled && expanded) setExpanded(false);
  return (
    <ExposedDropdownMenuBox
      expanded={enabled && expanded}
      onExpandedChange={enabled ? setExpanded : undefined}
    >
      <TextField
        value={labelState}
        readOnly
        enabled={enabled}
        colors={{
          focusedTextColor: colors.text,
          unfocusedTextColor: colors.text,
          disabledTextColor: colors.controlDisabledContent,
          focusedContainerColor: colors.controlSurface,
          unfocusedContainerColor: colors.controlSurface,
          disabledContainerColor: colors.controlDisabledSurface,
          cursorColor: colors.controlActive,
          focusedIndicatorColor: colors.controlActive,
          unfocusedIndicatorColor: colors.controlBorder,
          disabledIndicatorColor: colors.controlBorder,
          focusedTrailingIconColor: colors.controlActive,
          unfocusedTrailingIconColor: colors.muted,
          disabledTrailingIconColor: colors.controlDisabledContent,
        }}
        modifiers={[menuAnchor(), ...(testID ? [nativeTestID(testID)] : [])]}
      />
      <ExposedDropdownMenu
        expanded={enabled && expanded}
        onDismissRequest={() => setExpanded(false)}
        containerColor={colors.controlSurface}
      >
        {items.map((item, index) => (
          <DropdownMenuItem
            key={`${typeof item.value}:${item.value}`}
            enabled={enabled}
            elementColors={{
              textColor: colors.text,
              disabledTextColor: colors.controlDisabledContent,
              leadingIconColor: colors.controlActive,
              trailingIconColor: colors.muted,
            }}
            modifiers={[
              background(
                item.value === selectedValue ? colors.controlSelected : colors.controlSurface,
              ),
              ...(testID ? [nativeTestID(`${testID}-option-${index}`)] : []),
            ]}
            onClick={
              enabled
                ? () => {
                    onValueChange(item.value);
                    setExpanded(false);
                  }
                : undefined
            }
          >
            <DropdownMenuItem.Text>
              <Text color={colors.text}>{item.label}</Text>
            </DropdownMenuItem.Text>
          </DropdownMenuItem>
        ))}
      </ExposedDropdownMenu>
    </ExposedDropdownMenuBox>
  );
}
Picker.Item = UniversalPicker.Item;
