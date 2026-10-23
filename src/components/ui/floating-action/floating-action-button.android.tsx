import { Button, Shape } from '@expo/ui/jetpack-compose';
import { semantics, size, testID } from '@expo/ui/jetpack-compose/modifiers';
import type { NativeFloatingActionButtonProps } from './floating-action-button';

export function NativeFloatingActionButton({
  children,
  color,
  label,
  onPress,
  disabled,
  testID: id,
}: NativeFloatingActionButtonProps) {
  return (
    <Button
      onClick={disabled ? undefined : onPress}
      enabled={!disabled}
      // The installed native ShapeRecord defaults radius to zero, clipping
      // both the icon and the pointer target to the center of the button.
      shape={Shape.Circle({ radius: 1 })}
      colors={{
        containerColor: color,
        disabledContainerColor: color,
      }}
      contentPadding={{ start: 0, end: 0, top: 0, bottom: 0 }}
      modifiers={[size(76, 76), testID(id), semantics({ contentDescription: label })]}
    >
      {children}
    </Button>
  );
}
