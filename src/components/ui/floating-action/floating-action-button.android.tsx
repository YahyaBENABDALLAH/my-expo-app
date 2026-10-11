import { Icon } from '@expo/ui';
import { Button, Shape } from '@expo/ui/jetpack-compose';
import { semantics, size, testID } from '@expo/ui/jetpack-compose/modifiers';
import { useThemeColors } from '@/hooks/use-theme';
import { useHostColorScheme } from '../host/universal-host';
import type { FloatingActionButtonProps } from './floating-action-button.types';
import { floatingActionIcons, FLOATING_ACTION_ICON_SIZE } from './floating-action-icons';
export function FloatingActionButton({
  kind,
  label,
  onPress,
  disabled,
}: FloatingActionButtonProps) {
  const colors = useThemeColors(useHostColorScheme());
  return (
    <Button
      onClick={onPress}
      enabled={!disabled}
      shape={Shape.Circle({})}
      colors={{
        containerColor: 'transparent',
        disabledContainerColor: 'transparent',
        contentColor: colors.onPrimary,
      }}
      contentPadding={{ start: 0, end: 0, top: 0, bottom: 0 }}
      modifiers={[
        size(76, 76),
        testID('tab-context-action'),
        semantics({ contentDescription: label }),
      ]}
    >
      <Icon
        name={floatingActionIcons[kind]}
        size={FLOATING_ACTION_ICON_SIZE}
        color={colors.onPrimary}
      />
    </Button>
  );
}
