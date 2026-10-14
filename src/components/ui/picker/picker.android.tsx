import { Picker as UniversalPicker, type PickerProps, type PickerItemValue } from '@expo/ui';
import {
  DropdownMenuItem,
  ExposedDropdownMenu,
  ExposedDropdownMenuBox,
  Text,
  TextField,
  useNativeState,
} from '@expo/ui/jetpack-compose';
import { menuAnchor, testID as nativeTestID } from '@expo/ui/jetpack-compose/modifiers';
import { useEffect, useState } from 'react';
import { pickerItems } from './picker-items';

export function Picker<T extends PickerItemValue>({
  selectedValue,
  onValueChange,
  enabled = true,
  children,
  testID,
}: PickerProps<T>) {
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
        modifiers={[menuAnchor(), ...(testID ? [nativeTestID(testID)] : [])]}
      />
      <ExposedDropdownMenu
        expanded={enabled && expanded}
        onDismissRequest={() => setExpanded(false)}
      >
        {items.map((item, index) => (
          <DropdownMenuItem
            key={`${typeof item.value}:${item.value}`}
            enabled={enabled}
            modifiers={testID ? [nativeTestID(`${testID}-option-${index}`)] : undefined}
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
              <Text>{item.label}</Text>
            </DropdownMenuItem.Text>
          </DropdownMenuItem>
        ))}
      </ExposedDropdownMenu>
    </ExposedDropdownMenuBox>
  );
}
Picker.Item = UniversalPicker.Item;
