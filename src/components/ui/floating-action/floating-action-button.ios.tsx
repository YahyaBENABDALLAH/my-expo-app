import { Icon } from '@expo/ui';
import { Button, HStack } from '@expo/ui/swift-ui';
import {
  accessibilityLabel,
  buttonStyle,
  contentShape,
  disabled as nativeDisabled,
  frame,
  shapes,
} from '@expo/ui/swift-ui/modifiers';
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
      testID="tab-context-action"
      onPress={onPress}
      modifiers={[
        buttonStyle('plain'),
        nativeDisabled(Boolean(disabled)),
        accessibilityLabel(label),
      ]}
    >
      <HStack modifiers={[frame({ width: 76, height: 76 }), contentShape(shapes.circle())]}>
        <Icon
          name={floatingActionIcons[kind]}
          size={FLOATING_ACTION_ICON_SIZE}
          color={colors.onPrimary}
        />
      </HStack>
    </Button>
  );
}
