import { Button, HStack, Image } from '@expo/ui/swift-ui';
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

const symbols = {
  create: 'fork.knife',
  continue: 'plus',
  filters: 'slider.horizontal.3',
  'active-filters': 'slider.horizontal.3',
  liked: 'heart.fill',
  profile: 'fork.knife',
  submit: 'checkmark',
} as const;
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
        <Image systemName={symbols[kind]} size={28} color={colors.onPrimary} />
      </HStack>
    </Button>
  );
}
