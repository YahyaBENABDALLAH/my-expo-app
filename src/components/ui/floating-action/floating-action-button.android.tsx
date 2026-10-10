import { Button, Icon, Shape } from '@expo/ui/jetpack-compose';
import { semantics, size, testID } from '@expo/ui/jetpack-compose/modifiers';
import { useThemeColors } from '@/hooks/use-theme';
import { useHostColorScheme } from '../host/universal-host';
import type { FloatingActionButtonProps } from './floating-action-button.types';

const symbols = {
  create: require('@expo/material-symbols/fork_spoon.xml'),
  continue: require('@expo/material-symbols/add.xml'),
  filters: require('@expo/material-symbols/tune.xml'),
  'active-filters': require('@expo/material-symbols/tune.xml'),
  liked: require('@expo/material-symbols/favorite.xml'),
  profile: require('@expo/material-symbols/chef_hat.xml'),
  submit: require('@expo/material-symbols/check.xml'),
};
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
      <Icon source={symbols[kind]} size={28} tint={colors.onPrimary} />
    </Button>
  );
}
