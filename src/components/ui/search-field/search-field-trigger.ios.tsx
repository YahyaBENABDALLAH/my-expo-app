import { Button } from '@expo/ui/swift-ui';
import { accessibilityLabel, buttonStyle, contentShape, shapes } from '@expo/ui/swift-ui/modifiers';
import type { SearchFieldTriggerProps } from './search-field-trigger.types';

export function SearchFieldTrigger({ children, label, onPress, testID }: SearchFieldTriggerProps) {
  return (
    <Button
      onPress={onPress}
      testID={testID}
      modifiers={[
        buttonStyle('plain'),
        accessibilityLabel(label),
        contentShape(shapes.rectangle()),
      ]}
    >
      {children}
    </Button>
  );
}
