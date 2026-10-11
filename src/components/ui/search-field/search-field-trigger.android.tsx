import { Button, Shape } from '@expo/ui/jetpack-compose';
import {
  fillMaxWidth,
  semantics,
  testID as nativeTestID,
} from '@expo/ui/jetpack-compose/modifiers';
import { useThemeColors } from '@/hooks/use-theme';
import type { SearchFieldTriggerProps } from './search-field-trigger.types';

export function SearchFieldTrigger({
  children,
  label,
  onPress,
  testID,
  colorScheme,
}: SearchFieldTriggerProps) {
  const colors = useThemeColors(colorScheme);
  return (
    <Button
      onClick={onPress}
      colors={{ containerColor: colors.surface, contentColor: colors.muted }}
      contentPadding={{ start: 0, end: 0, top: 0, bottom: 0 }}
      shape={Shape.RoundedCorner({
        cornerRadii: { topStart: 12, topEnd: 12, bottomStart: 12, bottomEnd: 12 },
      })}
      modifiers={[
        fillMaxWidth(),
        semantics({ contentDescription: label }),
        ...(testID ? [nativeTestID(testID)] : []),
      ]}
    >
      {children}
    </Button>
  );
}
