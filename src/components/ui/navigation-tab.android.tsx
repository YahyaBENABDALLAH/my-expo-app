import { Column, Icon, Text } from '@expo/ui/jetpack-compose';
import {
  background,
  clip,
  fillMaxWidth,
  height,
  selectable,
  semantics,
  Shapes,
  size,
  testID as nativeTestID,
} from '@expo/ui/jetpack-compose/modifiers';
import type { NavigationTabProps } from './navigation-tab.types';

const symbols = {
  index: require('@expo/material-symbols/home.xml'),
  search: require('@expo/material-symbols/search.xml'),
  recipes: require('@expo/material-symbols/menu_book.xml'),
  more: require('@expo/material-symbols/menu.xml'),
};

export function NavigationTab({
  name,
  label,
  selected,
  color,
  selectedBackgroundColor,
  testID,
  onPress,
}: NavigationTabProps) {
  return (
    <Column
      horizontalAlignment="center"
      verticalArrangement="center"
      modifiers={[
        fillMaxWidth(),
        height(56),
        // Clip the native ripple before adding the selectable touch target.
        clip(Shapes.RoundedCorner(14)),
        selectable(selected, onPress, 'tab'),
        nativeTestID(testID),
        semantics({ contentDescription: label }),
      ]}
    >
      <Column horizontalAlignment="center" verticalArrangement={{ spacedBy: 4 }}>
        <Column
          horizontalAlignment="center"
          verticalArrangement="center"
          modifiers={[
            size(44, 28),
            clip(Shapes.RoundedCorner(14)),
            background(selected ? selectedBackgroundColor : 'transparent'),
          ]}
        >
          <Icon source={symbols[name]} size={name === 'index' ? 22 : 21} tint={color} />
        </Column>
        <Text color={color} style={{ fontSize: 12, fontWeight: '600' }}>
          {label}
        </Text>
      </Column>
    </Column>
  );
}
