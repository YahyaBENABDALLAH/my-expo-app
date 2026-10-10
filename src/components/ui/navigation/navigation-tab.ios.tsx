import { Button, Image, Text, VStack } from '@expo/ui/swift-ui';
import {
  accessibilityAddTraits,
  accessibilityLabel,
  background,
  buttonStyle,
  contentShape,
  font,
  foregroundStyle,
  frame,
  shapes,
} from '@expo/ui/swift-ui/modifiers';
import type { NavigationTabProps } from './navigation-tab.types';

const symbols = {
  index: 'house',
  search: 'magnifyingglass',
  recipes: 'book',
  more: 'line.3.horizontal',
} as const;

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
    <Button
      testID={testID}
      onPress={onPress}
      modifiers={[
        buttonStyle('plain'),
        accessibilityLabel(label),
        accessibilityAddTraits(selected ? ['isSelected'] : []),
      ]}
    >
      <VStack
        spacing={4}
        modifiers={[frame({ maxWidth: Infinity, height: 56 }), contentShape(shapes.rectangle())]}
      >
        <Image
          systemName={name === 'index' && selected ? 'house.fill' : symbols[name]}
          size={name === 'index' ? 22 : 21}
          color={color}
          modifiers={[
            frame({ width: 44, height: 28 }),
            background(selected ? selectedBackgroundColor : 'transparent', shapes.capsule()),
          ]}
        />
        <Text modifiers={[font({ size: 12, weight: 'semibold' }), foregroundStyle(color)]}>
          {label}
        </Text>
      </VStack>
    </Button>
  );
}
